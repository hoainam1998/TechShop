class Home_Model {

    renderSmartPhone(bindRenderSmartPhone) {
        $.get('/api/home/smartphone', (smartphone) => {
            bindRenderSmartPhone(smartphone);
        })
    }

    renderTablet(bindRenderTablet) {
        $.get('/api/home/tablet', (tablet) => {
            bindRenderTablet(tablet);
        })
    }

    renderLaptop(bindRenderLaptop) {
        $.get('/api/home/laptop', (laptop) => {
            bindRenderLaptop(laptop);
        })
    }

    renderPC(bindRenderPC) {
        $.get('/api/home/pc', (pc) => {
            bindRenderPC(pc);
        })
    }

    renderManHinh(bindRenderManHinh) {
        $.get('/api/home/manhinh', (manhinh) => {
            bindRenderManHinh(manhinh);
        })
    }

    renderTaiNghe(bindRenderTaiNghe) {
        $.get('/api/home/tainghe', (tainghe) => {
            bindRenderTaiNghe(tainghe);
        })
    }

    renderDiscountProduct(bindRenderDiscountProduct) {
        $.get('/api/home/discount_product', (discount_product) => {
            bindRenderDiscountProduct(discount_product);
        })
    }
}

class Home_View {

    bindRenderSmartPhoneToView(smartphones) {
        $('#listSmartPhoneName').empty();
        $('#listSmartPhoneNoibat').empty();

        smartphones.forEach(smartphone => {
            if (smartphone.NoiBat === true) {
                $('#listSmartPhoneName').append(`<li><a href="/${smartphone.DanhMuc}/${smartphone._id}">${smartphone.TenSP}</a></li>`);
            }

            let hinhsp = smartphone.HinhAnh.find(hinhanh => { return hinhanh.includes('png') })

            let cauhinh = smartphone.cauhinh[0];
            $('#listSmartPhoneNoibat').append(`
                <li>
                    <a href="/${smartphone.DanhMuc}/${smartphone._id}" class="itemProduct">
                        <img src="http://localhost:5000/images/smartphone_img/${hinhsp}" alt="samsungSaleOff">
                        <div class="inforItem">
                        <span class="nameItem">${smartphone.TenSP}</span>
                             <span class="price">
                            ${smartphone.GiaGiam === 0 ?
                    `<span class="newPrice">${smartphone.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>`
                    : `<span class="newPrice">${(smartphone.Gia - smartphone.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            <del class="oldPrice">${smartphone.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`}
                        </span>
                        <span class="cauhinh">
                                <span>CPU: ${cauhinh.CPU}</span>
                                <span>RAM: ${cauhinh.RAM} GB</span>
                        </span>
                        </div>
                    </a>
                </li>
            `)
        })
    }

    bindRenderLaptopToView(laptops) {
        $('#listLaptopName').empty();
        $('#listLaptopNoibat').empty();

        laptops.forEach(laptop => {
            if (laptop.NoiBat === true) {
                $('#listLaptopName').append(`<li><a href="/${laptop.DanhMuc}/${laptop._id}">${laptop.TenSP}</a></li>`);
            }

            let hinhsp = laptop.HinhAnh.find(hinhanh => { return hinhanh.includes('png') })

            let cauhinh = laptop.cauhinh[0]

            $('#listLaptopNoibat').append(`
                <li>
                    <a href="/${laptop.DanhMuc}/${laptop._id}" class="itemProduct">
                        <img src="http://localhost:5000/images/laptop_img/${hinhsp}" alt="samsungSaleOff">
                        <div class="inforItem">
                        <span class="nameItem">${laptop.TenSP}</span>
                             <span class="price">
                            ${laptop.GiaGiam === 0 ?
                    `<span class="newPrice">${laptop.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>`
                    : `<span class="newPrice">${(laptop.Gia - laptop.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            <del class="oldPrice">${laptop.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`}
                        </span>
                        <span class="cauhinh">
                                <span>CPU: ${cauhinh.CPU}</span>
                                <span>RAM: ${cauhinh.RAM}</span>
                        </span>
                        </div>
                    </a>
                </li>
            `)
        })
    }

    bindRenderTabletToView(tablets) {
        $('#listTabletName').empty();
        $('#listTabletNoibat').empty();

        tablets.forEach(tablet => {
            if (tablet.NoiBat === true) {
                $('#listTabletName').append(`<li><a href="/${tablet.DanhMuc}/${tablet._id}">${tablet.TenSP}</a></li>`);
            }

            let hinhsp = tablet.HinhAnh.find(hinhanh => { return hinhanh.includes('png') })

            let cauhinh = tablet.cauhinh[0];
            $('#listTabletNoibat').append(`
                <li>
                    <a href="/${tablet.DanhMuc}/${tablet._id}" class"itemProduct">
                        <img src="http://localhost:5000/images/tablet_img/${hinhsp}" alt="samsungSaleOff">
                        <div class="inforItem">
                        <span class="nameItem">${tablet.TenSP}</span>
                             <span class="price">
                            ${tablet.GiaGiam === 0 ?
                    `<span class="newPrice">${tablet.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>`
                    : `<span class="newPrice">${(tablet.Gia - tablet.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            <del class="oldPrice">${tablet.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`}
                        </span>
                        <span class="cauhinh">
                            <span>CPU: ${cauhinh.CPU}</span>
                            <span>RAM: ${cauhinh.RAM} GB</span>
                        </span>
                        </div>
                    </a>
                </li>
            `)
        })
    }

    bindRenderPCToView(pcs) {
        $('#listPCName').empty();
        $('#listPCNoibat').empty();

        pcs.forEach(pc => {
            if (pc.NoiBat === true) {
                $('#listPCName').append(`<li><a href="/${pc.DanhMuc}/${pc._id}">${pc.TenSP}</a></li>`);
            }

            let hinhsp = pc.HinhAnh.find(hinhanh => { return hinhanh.includes('png') })

            let cauhinh = pc.cauhinh[0];
            $('#listPCNoibat').append(`
                <li>
                    <a href="/${pc.DanhMuc}/${pc._id}" class="itemProduct">
                        <img src="http://localhost:5000/images/pc_img/${hinhsp}" alt="samsungSaleOff">
                        <div class="inforItem">
                        <span class="nameItem">${pc.TenSP}</span>
                             <span class="price">
                            ${pc.GiaGiam === 0 ?
                    `<span class="newPrice">${pc.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>`
                    : `<span class="newPrice">${(pc.Gia - pc.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            <del class="oldPrice">${pc.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`}
                        </span>
                        <span class="cauhinh">
                            <span>CPU: ${cauhinh.CPU}</span>
                            <span>RAM: ${cauhinh.RAM}></span>
                            <span>O Cung: ${cauhinh.OCung}></span>
                        </span>
                        </div>
                    </a>
                </li>
            `)
        })
    }

    bindRenderTaiNgheToView(tainghes) {
        $('#listTaiNgheName').empty();
        $('#listTaiNgheNoibat').empty();

        tainghes.forEach(tainghe => {
            if (tainghe.NoiBat === true) {
                $('#listTaiNgheName').append(`<li><a href="/${tainghe.DanhMuc}/${tainghe._id}">${tainghe.TenSP}</a></li>`);
            }

            let hinhsp = tainghe.HinhAnh.find(hinhanh => { return hinhanh.includes('png'); })

            let cauhinh = tainghe.cauhinh[0];
            $('#listTaiNgheNoibat').append(`
                <li>
                    <a href="/${tainghe.DanhMuc}/${tainghe._id}" class="itemProduct">
                        <img src="http://localhost:5000/images/tainghe_img/${hinhsp}" alt="samsungSaleOff">
                        <div class="inforItem">
                        <span class="nameItem">${tainghe.TenSP}</span>
                             <span class="price">
                            ${tainghe.GiaGiam === 0 ?
                    `<span class="newPrice">${tainghe.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>`
                    : `<span class="newPrice">${(tainghe.Gia - tainghe.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            <del class="oldPrice">${tainghe.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`}
                        </span>
                        <span class="cauhinh">
                            <span>${cauhinh.CongNghe}</span>
                        </span>
                        </div>
                    </a>
                </li>
            `)
        })
    }

    bindRenderManHinhToView(manhinhs) {
        $('#listManHinhName').empty();
        $('#listManHinhNoibat').empty();

        manhinhs.forEach(manhinh => {
            if (manhinh.NoiBat === true) {
                $('#listManHinhName').append(`<li><a href="/${manhinh.DanhMuc}/${manhinh._id}">${manhinh.TenSP}</a></li>`);
            }

            let hinhsp = manhinh.HinhAnh.find(hinhanh => {
                return hinhanh.includes('png');
            })

            let cauhinh = manhinh.cauhinh[0];
            $('#listManHinhNoibat').append(`
                <li>
                    <a href="/${manhinh.DanhMuc}/${manhinh._id}" class="itemProduct">
                        <img src="http://localhost:5000/images/manhinh_img/${hinhsp}" alt="samsungSaleOff">
                        <div class="inforItem">
                        <span class="nameItem">${manhinh.TenSP}</span>
                             <span class="price">
                            ${manhinh.GiaGiam === 0 ?
                    `<span class="newPrice">${manhinh.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>`
                    : `<span class="newPrice">${(manhinh.Gia - manhinh.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            <del class="oldPrice">${manhinh.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`}
                        </span>
                        <span class="cauhinh">
                                <span>Thoi gian dap ung: ${cauhinh.ThoiGianDapUng}</span>
                                <span>Tan so quet: ${cauhinh.TanSoQuet}</span>
                        </span>
                        </div>
                    </a>
                </li>
            `)
        })
    }

    bindRenderDiscountProductToView(discount_product) {
        $('.contentSaleOff').empty();
        $('#listDiscountProductName').empty();

        discount_product.forEach(product => {

            if($('#listDiscountProductName li').length<=3){
                $('#listDiscountProductName').append(`<li><a href="/${product.DanhMuc}/${product._id}">${product.TenSP}</a></li>`)
            }
            let hinhanhsp = product.HinhAnh.find(hinhanh => hinhanh.includes('png'))

            $('.contentSaleOff').append(`
            <li>
                <a href="/${product.DanhMuc}/${product._id}" class="itemProduct">
                    <img src="http://localhost:5000/images/${product.DanhMuc.toLowerCase()}_img/${hinhanhsp}" class="${product.DanhMuc.toLowerCase()}Img" "alt="oppoSaleOff">
                    <div class="inforItem">
                        <span class="nameItem">${product.TenSP}</span>
                        <span class="price">
                        ${product.GiaGiam === 0 ?
                            `<span class="newPrice">${product.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>`
                            :`<span class="newPrice">${(product.Gia - product.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            <del class="oldPrice">${product.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`}
                        </span>
                        <span class="sale">${product.GiaGiam.toLocaleString('it-IT',{style: 'currency',currency: 'VND'})}</span>
                    </div>
                </a>
            </li>
            `)
        })

        $('.contentSaleOff').owlCarousel({
            items: 6,
            loop: true,
            margin: 15,
            nav: true,
            dots: false,
            responsiveClass: true,
            responsive: {
                1080: { items: 5 },
                1024: { items: 4 },
                768: { items: 4 },
                375: { items: 2 }
            }
        });
    }
}

class Home_Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.renderSmartPhone(this.onRenderSmartPhoneToView);
        this.model.renderTablet(this.onRenderTabletToView);
        this.model.renderLaptop(this.onRenderLaptopToView);
        this.model.renderPC(this.onRenderPCToView);
        this.model.renderTaiNghe(this.onRenderTaiNgheToView);
        this.model.renderManHinh(this.onRenderManHinhToView)
        this.model.renderDiscountProduct(this.onRenderDiscountProductToView);
    }

    onRenderSmartPhoneToView = (smartphones) => {
        this.view.bindRenderSmartPhoneToView(smartphones);
    }

    onRenderLaptopToView = (laptops) => {
        this.view.bindRenderLaptopToView(laptops);
    }

    onRenderTabletToView = (tablets) => {
        this.view.bindRenderTabletToView(tablets);
    }

    onRenderPCToView = (pcs) => {
        this.view.bindRenderPCToView(pcs);
    }

    onRenderTaiNgheToView = (tainghes) => {
        this.view.bindRenderTaiNgheToView(tainghes);
    }

    onRenderManHinhToView = (manhinh) => {
        this.view.bindRenderManHinhToView(manhinh);
    }

    onRenderDiscountProductToView = (discount_product) => {
        this.view.bindRenderDiscountProductToView(discount_product);
    }
}

