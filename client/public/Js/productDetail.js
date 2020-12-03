
class Product_Model {
    constructor() {
        this.listParam = location.pathname.split('/');
        $.get(`/api/home/${this.listParam[1]}/${this.listParam[2]}`, (product) => {
            this.bindRenderImagesProduct(product[0]);
            this.bindRenderBreadCrumb(product[0]);
            this.bindRenderPrice(product[0]);
            this.bindRenderDiscount(product[0].KhuyenMai);
            this.bindRenderDiscountGift(product[0]);
            this.bindRenderService(product[0]);
            this.getProductRelated(product[0]);
            this.bindRenderConfiguration(product[0].cauhinh[0]);
            this.bindBuyProduct(product[0]);
        })
    }

    renderImagesProduct(bindRenderImagesProduct) {
        this.bindRenderImagesProduct = bindRenderImagesProduct;
    }

    renderBreadCrumb(bindRenderBreadCrumb) {
        this.bindRenderBreadCrumb = bindRenderBreadCrumb;
    }

    renderPrice(bindRenderPrice) {
        this.bindRenderPrice = bindRenderPrice;
    }

    renderDiscount(bindRenderDiscount) {
        this.bindRenderDiscount = bindRenderDiscount;
    }

    renderDiscountGift(bindRenderDiscountGift) {
        this.bindRenderDiscountGift = bindRenderDiscountGift;
    }

    renderService(bindRenderService) {
        this.bindRenderService = bindRenderService;
    }

    renderConfiguration(bindRenderConfiguration) {
        this.bindRenderConfiguration = bindRenderConfiguration;
    }

    getProductRelated(product) {
        $.get(`/api/home/${product.DanhMuc}/${product.TenThuongHieu}/${product._id}`, (productsRelated) => {
            console.log(product.DanhMuc + ' ' + product.TenThuongHieu + ' ' + product._id);
            this.bindRenderProductRelated(productsRelated);
        })
    }

    renderProductRelated(bindRenderProductRelated) {
        this.bindRenderProductRelated = bindRenderProductRelated;
    }

    buyProduct(bindBuyProduct) {
        this.bindBuyProduct = bindBuyProduct;
    }
}

class Product_View {

    bindRenderImagesProduct(product) {
        $('.nameProduct').text(product.DanhMuc + ' ' + product.TenSP);
        $('.productCollection').empty();
        product.HinhAnh.forEach(function (hinhanh) {
            $('.productCollection').append(`<img src="http://localhost:5000/images/${product.DanhMuc.toLowerCase()}_img/${hinhanh}" alt="xiaomi" >`)
        })

        let $fotoramaDiv = $('.productCollection').fotorama({ allowfullscreen: true });
        let fotorama = $fotoramaDiv.data('fotorama');
        if (window.outerWidth <= 768) {
            fotorama.destroy();
            $('.fotorama').fotorama({ allowfullscreen: false })
        }
    }

    bindRenderBreadCrumb(product) {
        $('.listBreadCumb li:nth-child(2) a').text(product.DanhMuc).attr('href', `/${product.DanhMuc}`);
        $('.listBreadCumb li:nth-child(3) a').text(product.TenThuongHieu).attr('href', `/${product.DanhMuc}/?thuonghieu=${product.TenThuongHieu}`);
        $('.listBreadCumb li:nth-child(4)').text(product.TenSP);
    }

    bindRenderPrice(product) {
        if (product.GiaGiam > 0) {
            $('.newPrice').text((product.Gia - product.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
            $('.oldPrice >del').show().text(product.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
        } else {
            $('.newPrice').text(product.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
            $('.oldPrice >del').hide();
        }
    }

    bindRenderDiscount(discount) {
        $('.listDiscount').empty().show();
        if (discount.length > 0) {
            discount.forEach(function (item) {
                $('.listDiscount').append(`<li>${item}</li>`)
            })
        } else { $('.listDiscount').hide() }
    }

    bindRenderDiscountGift(product) {
        let discountGift = product.QuaKhuyenMai;
        $('.listDiscountGift').empty();
        $('.discountGiftCollection').empty();
        if (discountGift.length > 0) {
            discountGift.forEach(function (item, index) {
                $('.listDiscountGift').append(`
                            <li data-index="${index}">
                                <img src="http://localhost:5000/images/${product.DanhMuc.toLowerCase()}_img/${item.HinhKhuyenMai}" alt="taingheoneplus">
                                <a href="#">${item.TenQuaKM}</a>
                            </li>
                `)
                $('.discountGiftCollection').append(
                    `<img src="http://localhost:5000/images/${product.DanhMuc.toLowerCase()}_img/${item.HinhKhuyenMai}" alt="qua">
                    `);
            })

            if (window.outerWidth > 768) {
                $('.listDiscountGift li').click(function () {
                    showIndex(parseInt($(this).data('index')));
                })
            }

            function showIndex(index) {
                $('.discountGiftCollection').show();
                let $listDiscountGift = $('.discountGiftCollection').fotorama();
                let discountGiftFotorama = $listDiscountGift.data('fotorama');
                discountGiftFotorama.requestFullScreen();
                discountGiftFotorama.show(index);
                addEventforFotoramaExitFullScreen($listDiscountGift)
            }

            function addEventforFotoramaExitFullScreen(el) {
                $(el).on('fotorama:fullscreenexit', function () {
                    el.data('fotorama').destroy();
                    el.hide();
                })
            }
        } else {
            $('.listDiscountGift').parent().hide();
            $('.discountGiftCollection').hide();
        }
    }

    bindRenderService(product) {
        $('.listService li:first-child a').text();
        let access = product.PhuKien;
        let guarantee = product.BaoHanh;
        if (access.length > 0) {
            let listAccess = '';
            access.forEach(function (item, index) {
                if (access.indexOf(item) === access.length - 1) {
                    listAccess += item + '.';
                } else {
                    listAccess += item + ', ';
                }
            })
            $('.listService li:first-child a').text(listAccess);
        } else {
            $('.listService li:first-child').hide();
        }

        $('.listService li:nth-child(2)').text(`Bảo hành chính hãng ${guarantee} tháng.`);
    }

    bindRenderConfiguration(cauhinh) {
        $('.listFeature').empty();
        let str = '';
        Object.keys(cauhinh).forEach(function (fieldname) {
            if (fieldname === '_id' || fieldname === '__v') { return }
            str += `<li><span>${fieldname}</span> <span>${cauhinh[`${fieldname}`]}</span></li>`;
        })

        $('.listFeature').append(str);
    }

    bindRenderProductRelated(products) {
        $('.listProduct').empty();
        $('.featureMainProduct').empty();
        if (products.length > 0) {
            $('.relatedProduct').show();
            products.forEach(function (item) {
                let hinhanh = item.HinhAnh.find(ha => ha.includes('png'));
                let cauhinh = item.cauhinh[0];
                let licauhinh = '';
                Object.keys(cauhinh).forEach(function (fieldname, index) {
                    if (fieldname === '_id' || fieldname === '__v') { return }
                    if (index < 5) {
                        licauhinh += `<li>${fieldname}: ${cauhinh[`${fieldname}`]}</li>`;
                    } else { return }
                })
                $('.listProduct').append(`
                    <li>
                        <a href="/${item.DanhMuc}/${item._id}">
                            <img src="http://localhost:5000/images/${item.DanhMuc.toLowerCase()}_img/${hinhanh}" alt="productrelated" class="${item.DanhMuc.toLowerCase()}Img">
                            <div class="inforProductMain">
                                <h5>${item.TenSP}</h5>
                                <span class="priceMainProduct">
                                    <span class="newPrice">${(item.Gia - item.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                                    ${item.Gia > 0
                        ? `<del class="oldPrice">${item.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`
                        : ''} 
                                </span>
                            </div>
                            <ul class="featureMainProduct">
                                    ${licauhinh}
                            </ul>
                        </a>
                    </li>
            `)
            })
        }else { $('.relatedProduct').hide()}
    }

    bindBuyProduct(product) {
        console.log('buy')
        $('.buyNow').click((evt) => {
            evt.preventDefault();
            Cart_Container.addProductToCart(product);
            location.pathname = $(evt.target).attr('href');
        })
    }
}

class Product_Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.renderImagesProduct(this.onRenderImagesProduct);
        this.model.renderBreadCrumb(this.onRenderBreadCrumb);
        this.model.renderPrice(this.onRenderPrice);
        this.model.renderService(this.onRenderService);
        this.model.renderDiscount(this.onRenderDiscount);
        this.model.renderDiscountGift(this.onRenderDiscountGift);
        this.model.renderConfiguration(this.onRenderConfiguration);
        this.model.renderProductRelated(this.onRenderProductRelated);
        this.model.buyProduct(this.onBuyProduct);
    }

    onRenderImagesProduct = (product) => {
        this.view.bindRenderImagesProduct(product);
    }

    onRenderBreadCrumb = (product) => {
        this.view.bindRenderBreadCrumb(product);
    }

    onRenderPrice = (product) => {
        this.view.bindRenderPrice(product);
    }

    onRenderDiscount = (discount) => {
        this.view.bindRenderDiscount(discount);
    }

    onRenderDiscountGift = (product) => {
        this.view.bindRenderDiscountGift(product);
    }

    onRenderService = (product) => {
        this.view.bindRenderService(product);
    }

    onRenderConfiguration = (configuration) => {
        this.view.bindRenderConfiguration(configuration);
    }

    onRenderProductRelated = (products) => {
        this.view.bindRenderProductRelated(products);
    }

    onBuyProduct = (product) => {
        this.view.bindBuyProduct(product);
    }
}