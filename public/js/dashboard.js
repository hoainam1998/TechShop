$(document).ready(function () {
    class Model {
        constructor() {
            this._commit();
        }

        listProductChanged(callback) {
            this.onListProductChanged = callback;
        }

        productChanged(callback) {
            this.onProductChanged = callback;
        }

        addProduct(formdata) {
            $.ajax({
                url: '/api/create',
                type: 'POST',
                enctype: 'multipart/form-data',
                data: formdata,
                cache: false,
                processData: false,
                contentType: false,
                success: (success) => {
                    if (success === true) {
                        console.log('submit');
                        this._commit();
                    }
                }
            })
        }

        updateProduct() {
            console.log('update product');
        }

        deleteAllProduct() {
            console.log('del all');
            $.ajax({
                url: '/api/removeAll',
                type: 'DELETE',
                success: (data) => {
                    if (data) { this._commit(); }
                }
            })
        }

        deleteSpecixProduct(listIdProduct) {
            console.log(listIdProduct);
            listIdProduct.forEach(itemId => {
                $.ajax({
                    url: `/api/remove/${itemId}`,
                    type: 'DELETE',
                    success: (data) => {
                        if (data) { this._commit(); }
                    }
                })
            })
        }

        getProduct(idProduct) {
            console.log(idProduct);
            $.get('/api/' + idProduct, (data) => {
                this.onProductChanged(data);
            })
        }

        searchProduct(nameProduct) {
            $.get('/api/search/' + nameProduct, (data) => {
                this.onListProductChanged(data);
            })
        }

        _commit() {
            $.get('/api/all', (data) => {
                this.onListProductChanged(data);
            })
        }
    }

    class View {
        constructor() {
            this.showDetailData();
            this.hideDetailData();
            this.addEventforAddBtn($('.addDiscount'));
            this.addEventforAddBtn($('.addAccessories'));
            this.addEventHinhspChange();
            this.addEventTenquaKM();
            this.renderFieldName();
            this.addEventForSelectAll();
            this.addEventForDataItemSelected();
        }

        showDetailData() {
            $('.fa-plus-square').click(function () {
                $('.detailItemData').show();
                $('.submit').text('Them');
            })
        }

        hideDetailData() {
            $('.hide').click(function (evt) {
                evt.preventDefault();
                $('.detailItemData').hide();
            })
        }

        renderFieldName() {
            $('.listFieldName').empty();
            let listFiledName = ['Hinh Anh', 'Ten SP', 'Gia', 'Gia Giam', 'So Luong', 'Bao Hanh'];
            listFiledName.forEach(filed => {
                $('.listFieldName').append(`<li>${filed}</li>`);
            })
            $('.listFieldName').append('<li></li>')
        }

        displayProduct(listProduct) {
            $('.listData').empty();
            listProduct.forEach(product => {
                $('.listData').append(`<li><a href="#" id="${product._id}" class="itemDataProduct"><ul class="listField"></ul</a></li>`);
                let stringData = `<li><img src="/images/${product.HinhAnh[0]}" alt="imgProduct"> </li>
                                <li>${product.TenSP}</li>
                                <li>${product.Gia} đ</li>
                                <li>${product.GiaGiam} đ</li>
                                <li>${product.SoLuong}</li>
                                <li>${product.BaoHanh} tháng</li>
                                <li><button class="btn_read" style="margin-right: 7px;"></button><button class="btn_update"></button></li>`
                $(`#${product._id} .listField`).append(stringData);
            })
            this.addEventForDataItemSelected();
            this.bindReadProduct();
            this.bindUpdateProduct();
        }

        bindAddProduct(handler) {
            $('.submit').click((evt) => {
                evt.preventDefault();
                this.getDataFromFormData();
                let formdata = new FormData($('#dashboardForm')[0]);

                handler(formdata);
            })
        }

        getDataFromFormData() {
            let tenquakm = [];
            let listkhuyenmai = [];
            let listphukien = [];

            $('.listDiscountGift li span').each(function () {
                tenquakm.push($(this).html());
            })

            $('#listKhuyenMai li').each(function () {
                listkhuyenmai.push($(this).text());
            })

            $('#listphukien li').each(function () {
                listphukien.push($(this).text());
            })

            $('input[name="khuyenmai"]').val(listkhuyenmai);
            $('input[name="tenquakm"]').val(tenquakm);
            $('input[name="phukien"]').val(listphukien);
        }

        addEventforAddBtn(elToAdd) {
            elToAdd.click((evt) => {
                evt.preventDefault();
                let value = $(evt.target).prev().val();
                elToAdd.next().append(`<li>${value}<i class="far fa-times-circle"></i></li>`);
                this.addEventForDelBtn();
                $(evt.target).prev().val('');
            })
        }

        addEventForDelBtn() {
            $('.fa-times-circle').click(function () {
                $(this).parent().remove();
            })
        }

        addEventHinhspChange() {
            $('input[name="hinhsp"]').change(function () {
                let fileList = this.files;
                for (let i = 0; i < fileList.length; i++) {
                    let dataReader = new FileReader();
                    dataReader.onload = function (evt) {
                        $('.listHinhAnh').append(`<li>
                                                <img src="${evt.target.result}" alt="product">
                                            </li>`);
                    }
                    dataReader.readAsDataURL(this.files[i]);
                }
            })
        }

        addEventTenquaKM() {
            let listtenquakm = [];
            $('.addnameDiscount').click(() => {
                let tenquakm = $('input[name="tenquakm"]').val();
                listtenquakm.push(tenquakm);
                $('input[name="tenquakm"]').val('')
                $('.listDiscountGift').append(`<li>
                                        <img src="images/1024px-No_image_available.svg.webp" alt="imgDiscount">
                                        <span>${tenquakm}</span>
                                        <input type="file" name="hinhkhuyenmai" style="margin-left:.4rem">
                                    </li>`);
                this.addEventforInputHinhKM();
            })
        }

        addEventforInputHinhKM() {
            $('input[name="hinhkhuyenmai"]').change(function () {
                let reader = new FileReader();
                let img = $(this).prev().prev();
                reader.onload = function (evt) {
                    img.attr('src', evt.target.result);
                }
                reader.readAsDataURL(this.files[0]);
            })
        }

        addEventForDataItemSelected() {
            $('.itemDataProduct').click(function (evt) {
                evt.preventDefault();
                $(this).parent().toggleClass('selectAllDataitem');
            })
        }

        addEventForSelectAll() {
            $('input[name="selectAll"]').change(function () {
                if (this.checked) {
                    $('.listData li').addClass('selectAllDataitem');
                } else {
                    $('.listData li').removeClass('selectAllDataitem');
                }
            })
        }

        bindSearchProduct(handler) {
            $('.search button[type="submit"]').click(function (evt) {
                evt.preventDefault();
                let valueSearch = $('input[name="search"]').val();
                handler(valueSearch);
            })
        }

        bindDeleteProduct(handlerDeleteAll, handlerDeleteSpecix) {
            $('.fa-trash').click(function () {
                if ($('input[name="selectAll"]').is(':checked')) {
                    handlerDeleteAll();
                } else {
                    let listIdProduct = [];
                    $('.selectAllDataitem').each(function () {
                        listIdProduct.push($(this).children('a').attr('id'));
                    })
                    handlerDeleteSpecix(listIdProduct);
                }
            })
        }

        displayDetailProduct(product) {

            $('#listphukien').empty();
            $('.listDiscountGift').empty();
            $('#listKhuyenMai').empty();
            $('.listHinhAnh').empty();
            $('.addnameDiscount').hide();
            $('input[name="tensp"]').val(product.TenSP);
            $('input[name="gia"]').val(product.Gia);
            $('input[name="giagiam"]').val(product.GiaGiam);
            $('input[name="soluong"]').val(product.SoLuong);
            $('#baohanh').val(product.BaoHanh);
            $('input[name="thuonghieu"]').val(product.TenThuongHieu);
            $('input[name="danhmuc"]').val(product.DanhMuc);

            let listHinhsp='';
            for(let hinhsp of product.HinhAnh){
                listHinhsp+=`<li><img src="./images/${hinhsp}" alt="imgProduct" /></li>`;
            }

            let listKhuyenMai='';
            for(let km of product.KhuyenMai){
                listKhuyenMai+=`<li>${km}</li>`;
            }

            let listTenQuaKM='';
            for(let tenquakm of product.QuaKhuyenMai){
                listTenQuaKM+=`<li>
                                <img src="./images/${tenquakm.HinhKhuyenMai}" alt="imgProduct" />
                                <span>${tenquakm.TenQuaKM}</span>
                            </li>`
            }

            let listPhuKien='';
            for(let phukien of product.PhuKien){
                listPhuKien +=`<li>${phukien}</li>`
            }

            $('#listphukien').append(listPhuKien);

            $('.listDiscountGift').append(listTenQuaKM);

            $('#listKhuyenMai').append(listKhuyenMai);

            $('.listHinhAnh').append(listHinhsp);
        }

        readProduct(callback) {
            this.handlerReadProduct = callback;
        }

        updateProduct(callback) {
            this.handlerUpdateProduct = callback;
        }

        bindReadProduct() {
            $('.btn_read').click((evt) => {
                console.log('btnread');
                let id = $(evt.target).parents('.itemDataProduct').attr('id');
                this.handlerReadProduct(id);
                $('.detailItemData').show();
                $('.add').hide();
                $('input[name="mota"]').hide();
                $('input[name="hinhsp"]').hide();
                $('input[name="khuyenmai"]').hide();
                $('input[name="phukien"]').hide();
                $('input[name="tenquakm"]').hide();
                $('.submit').hide();
                $('input[name="tensp"]').attr('readonly',true);
                $('input[name="gia"]').attr('readonly',true);
                $('input[name="giagiam"]').attr('readonly',true);
                $('input[name="soluong"]').attr('readonly',true);
                $('#baohanh').attr('disabled',true);
                $('input[name="thuonghieu"]').attr('readonly',true);
                $('input[name="danhmuc"]').attr('readonly',true);
            })
        }

        bindUpdateProduct() {
            $('.btn_update').click((evt) => {
                let id = $(evt.target).parents('.itemDataProduct').attr('id');
                this.handlerReadProduct(id);
                $('.detailItemData').show();
                $('.add').show();
                // $('#listphukien').empty();
                // $('.listDiscountGift').empty();
                // $('#listKhuyenMai').empty();
                // $('.listHinhAnh').empty();
                $('.submit').show().click((evt) => {
                    evt.preventDefault();
                    console.log('submit');
                    // this.handlerUpdate(id,formdata);
                });
            })
        }
    }

    class Controller {
        constructor(model, view) {
            this.model = model;
            this.view = view;

            this.model.listProductChanged(this.onListProductChanged);
            this.model.productChanged(this.onProductChanged);
            this.view.bindAddProduct(this.onAddProduct);
            this.view.bindDeleteProduct(this.onDeleteAllProduct, this.onDeleteSpecixProduct);
            this.view.bindSearchProduct(this.onSearchProduct);
            this.view.readProduct(this.onReadProduct);
            this.view.updateProduct(this.onUpdateProduct);
        }

        onProductChanged = (product) => {
            this.view.displayDetailProduct(product);
        }

        onListProductChanged = (listProduct) => {
            this.view.displayProduct(listProduct);
        }

        onReadProduct = (idProduct) => {
            this.model.getProduct(idProduct);
        }

        onAddProduct = (formdata) => {
            this.model.addProduct(formdata);
        }

        onUpdateProduct = (idProduct, formdata) => {
            this.model.updateProduct(idProduct, formdata);
        }

        onDeleteAllProduct = () => {
            this.model.deleteAllProduct();
        }

        onDeleteSpecixProduct = (listIDProduct) => {
            this.model.deleteSpecixProduct(listIDProduct);
        }

        onSearchProduct = (nameProduct) => {
            this.model.searchProduct(nameProduct);
        }

    }

    const App = new Controller(new Model(), new View());
})

