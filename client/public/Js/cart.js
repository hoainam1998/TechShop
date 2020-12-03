class Cart_Model {
    constructor() {
        setTimeout(() => {
            this.Init();
        }, 1)

        $.get('/Json/local.json', (address) => {
            this.bindRenderAddress(address);
        })
    }

    renderProductCart(bindRenderProductCart) {
        this.bindRenderProductCart = bindRenderProductCart;
    }

    renderAddress(bindRenderAddress) {
        this.bindRenderAddress = bindRenderAddress;
    }

    Init() {
        let listProduct = JSON.parse(localStorage.getItem('cart')) || [];
        this.bindRenderProductCart(listProduct);
    }

    createOrder(khachhang,order,ttsp){
        $.post('/api/cart/createKhachHang',khachhang,(id_khachhang)=>{
           order.id_khachhang=id_khachhang;
           $.post('/api/cart/createOrder',order,(id_order)=>{
               let order_detail={id_order: id_order,ttsp: ttsp};
               $.post('/api/cart/createOrderDetail',order_detail,(success)=>{
                   if(success===true){ this.renderPaymentSuccess()};
               })
           })
        })
    }

    renderPaymentSuccess(renderPaymentSuccess){
        this.renderPaymentSuccess=renderPaymentSuccess;
    }

}

class Cart_View {
    bindRenderProductToCart(products) {
        if (products.length > 0) {
            $('.listCart').empty();
            products.forEach((item) => {

                let hinhanhsp = item.HinhAnh.find(hinhanh => hinhanh.includes('png'));

                let khuyenmai = '';

                item.KhuyenMai.forEach(function (km) {
                    khuyenmai += `<li>${km}</li>`;
                })

                $('.listCart').append(`
                <li>
                    <a href="/${item.DanhMuc}/${item._id}"><img src="http://localhost:5000/images/${item.DanhMuc.toLowerCase()}_img/${hinhanhsp}" alt="cartImg"></a>
                    <div class="name_discount">
                        <a href="#">${item.TenSP}</a>
                        <ul class="listDiscount">
                            ${khuyenmai}
                        </ul>
                    </div>
                    <div class="quantity_color_remove">
                        <span class="cart_price">
                            <span class="newPrice" data-price="${(item.Gia - item.GiaGiam)}">${(item.Gia - item.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>                   
                             ${item.GiaGiam > 0 ? `<del class="oldPrice">${item.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>` : ''}
                        </span>
                        <div class="btn-controlQuantity">
                            <button class="minus">-</button>
                            <span class="value" data-quantity="${item.SoLuong}">1</span>
                            <button class="plus">+</button>
                        </div>
                        <a href="#" class="remove" data-id=${item._id}>xoa</a>
                    </div>
                </li>
            `)
            })

            this.removeItemCart();
            this.total();

            $('.btn-controlQuantity').click(evt => {
                if ($(evt.target).is($('.minus'))) {
                    let value = parseInt($(evt.target).next().text()) - 1;
                    if (value === 0) {
                        value = 1
                        $(evt.target).next().text(value);
                    } else { $(evt.target).next().text(value); }

                } else if ($(evt.target).is($('.plus'))) {
                    let value = parseInt($(evt.target).prev().text()) + 1;
                    let quantity = parseInt($(evt.target).prev().data('quantity'))
                    if (value >= quantity) {
                        value = quanity
                        $(evt.target).prev().text(value);
                    } else { $(evt.target).prev().text(value); }
                }

                this.total();
            })
        } else {
            $('.layoutCart').hide();
            $('.noItem').show();
        }
    }

    total() {
        let total = 0
        $('.listCart >li').each(function () {
            let price = $(this).find('.newPrice').data('price');
            let quantity = parseInt($(this).find('.value').text());
            total += quantity * price;
        })
        $('.needPay >span:last-child').attr('data-price',total).text(total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
    }

    removeItemCart() {
        $('.remove').click(evt => {
            evt.preventDefault();
            Cart_Container.deleteProductCart($(evt.target).data('id'));
            this.reRender();
        })
    }

    reRender(reRender) {
        this.reRender = reRender;
    }

    bindRenderAddress(address) {
        this.address = address;
        this.bindRenderThanhpho();
        this.bindRenderQuanHuyen();
        this.bindRenderXaPhuong();
    }

    bindRenderThanhpho() {
        $('#province').empty();
        this.address.forEach(function (thanhpho) {
            $('#province').append(`<option value="${thanhpho.name}">${thanhpho.name}</option>`)
        })

        let thanhpho = this.address.find(tp => tp.name === $('#province').val());
        let quanhuyens = thanhpho.districts;
        $('#district').empty();
        quanhuyens.forEach(function (qh) {
            $('#district').append(`<option value="${qh.name}">${qh.name}</option>`)
        })

        let quanhuyen = quanhuyens.find(ds => ds.name === $('#district').val());
        let xaphuong = quanhuyen.wards
        $('#village').empty();
        xaphuong.forEach(function (xp) {
            $('#village').append(`<option value="${xp.prefix+' '+xp.name}">${xp.prefix+' '+xp.name}</option>`)
        })
    }

    bindRenderQuanHuyen() {
        $('#province').change((evt) => {
            let thanhpho = this.address.find(tp => tp.name === $(evt.target).val());
            let quanhuyens = thanhpho.districts;
            $('#district').empty();
            quanhuyens.forEach(function (qh) {
                $('#district').append(`<option value="${qh.name}">${qh.name}</option>`)
            })

            let quanhuyen = quanhuyens.find(ds => ds.name === $('#district').val());
            let xaphuong = quanhuyen.wards
            $('#village').empty();
            xaphuong.forEach(function (xp) {
                $('#village').append(`<option value="${xp.prefix+' '+xp.name}">${xp.prefix+' '+xp.name}</option>`)
            })
        })
    }

    bindRenderXaPhuong() {
        $('#district').change((evt) => {
            let thanhpho = this.address.find(tp => tp.name === $('#province').val());
            let quanhuyen = thanhpho.districts.find(ds => ds.name === $(evt.target).val());

            let xaphuong = quanhuyen.wards
            $('#village').empty();
            xaphuong.forEach(function (xp) {
                $('#village').append(`<option value="${xp.prefix+' '+xp.name}">${xp.prefix+' '+xp.name}</option>`)
            })
        })
    }
    
    bindDatHang(createOrder){
        $('#dathang').click(function(evt){
            evt.preventDefault();
            Cart_Container.deleteAllCart();
            let khachhang={
                HoTen: $('input[name="nameCustomer"]').val(),
                SoDienThoai: $('input[name="phone"]').val(),
                GioiTinh: $('input[name="gender"]').val(),
                Tinh_ThanhPho: $('#province').val(),
                Quan_Huyen: $('#district').val(),
                Xa_Phuong: $('#village').val(),
                Sonha_Tenduong: $('input[name="detailAddress"]').val()
            }

            let order={
                TongTienThanhToan: $('.needPay >span:last-child').data('price'),
                YeuCau: $('input[name="note"]').val()
            }
            
            let ttsp=[];
            $('.listCart .quantity_color_remove').each(function(){
                let sp={
                    MaSP: $(this).find('.remove').data('id'),
                    SoLuong: parseInt($(this).find('.value').text()),
                    ThanhTien: parseInt($(this).find('.value').text())*parseInt($(this).find('.newPrice').data('price'))
                }
                ttsp.push(sp);
            })

            createOrder(khachhang,order,ttsp);
        })
    }

    renderPaymentSuccess(){
        $('.payment_success').show();
        $('.layoutCart').hide();
    }
}

class Cart_Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.renderProductCart(this.onRenderProductCart);
        this.view.reRender(this.onRerender);
        this.model.renderAddress(this.onRenderAddress);
        this.view.bindDatHang(this.onCreateOrder);
        this.model.renderPaymentSuccess(this.onPaymentSuccess);
    }

    onRenderProductCart = (products) => {
        this.view.bindRenderProductToCart(products);
    }

    onRerender = () => {
        this.model.Init();
    }

    onRenderAddress = (address) => {
        this.view.bindRenderAddress(address);
    }

    onCreateOrder=(khachhang,order,ttsp)=>{
        this.model.createOrder(khachhang,order,ttsp);
    }

    onPaymentSuccess=()=>{
        this.view.renderPaymentSuccess();
    }
}