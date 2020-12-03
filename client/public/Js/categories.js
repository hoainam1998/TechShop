class Categories_Model {
    constructor() {
        this.categories = location.pathname.slice(1);
        this.thuonghieu=new URLSearchParams(location.search).get('thuonghieu');
        $.get('/api/home/' + this.categories.toLowerCase(),(items) => {
            this.items = items;
            if(this.thuonghieu){
                this.items=this.items.filter(item=>item.TenThuongHieu===this.thuonghieu);
            }
            this.bindRenderAllItem(this.items);
            this.returnAllLogo();
            this.getListItemToSort(this.items);
        })
    }

    getListItemToSort(items) {
        this.listItemToSort = items;
    }

    renderAllItem(bindRenderAllItem) {
        this.bindRenderAllItem = bindRenderAllItem;
    }

    returnAllLogo() {
        if (this.categories === 'manhinh' || this.categories === 'tainghe') {
            return;
        } else {
            let listLogo = [];
            this.items.forEach(function (item) {
                if (listLogo.includes(item.TenThuongHieu) === false) {
                    listLogo.push(item.TenThuongHieu);
                }
            })
            this.onRenderAllLogo(listLogo);
        }
    }

    renderAllLogo(onRenderAllLogo) {
        this.onRenderAllLogo = onRenderAllLogo;
    }

    sortItem(condition) {
        switch (condition) {
            case 'tang': {
                this.listItemToSort.sort(function (smA, smB) {
                    return smA.Gia - smB.Gia;
                })
                this.bindRenderAllItem(this.listItemToSort);
            }; break;
            case 'giam': {
                this.listItemToSort.sort(function (smA, smB) {
                    return smB.Gia - smA.Gia;
                })
                this.bindRenderAllItem(this.listItemToSort);
            }; break;
            case 'noibat': {
                let listItemNoiBat = this.listItemToSort.filter(item => item.NoiBat === true);
                this.bindRenderAllItem(listItemNoiBat);
            }; break;
        }
    }

    filterItem(brand, price, cpu, ram) {
        let listItemFiltered = this.items;
        if (brand.length > 0) {
            listItemFiltered = this.items.filter(item => item.TenThuongHieu === brand.attr('href'));
        }

        if (price.length > 0) {
            listItemFiltered = listItemFiltered.filter(item => item.Gia >= price.data('min') * 1000000 && item.Gia <= price.data('max') * 1000000);
        }

        if (cpu.length > 0) {
            listItemFiltered = listItemFiltered.filter(item => item.cauhinh[0].CPU.includes(cpu.val()));
        }

        if (ram.length > 0) {
            if (this.categories === 'laptop' || this.categories === 'pc') {
                listItemFiltered = listItemFiltered.filter(laptop => laptop.cauhinh[0].RAM.includes(ram.val()));
            } else {
                listItemFiltered = listItemFiltered.filter(item => item.cauhinh[0].RAM===ram.val());
            }
        }

        this.bindRenderAllItem(listItemFiltered);
        this.getListItemToSort(listItemFiltered);
    }
}

class Categories_View {
    constructor() {
        this.categoriesName = location.pathname.slice(1);
        this.thuonghieu=new URLSearchParams(location.search).get('thuonghieu');
        if(this.thuonghieu){this.categoriesName=this.categoriesName.slice(0,this.categoriesName.length-1); }
        $('.listBreadCumb li:nth-child(2) a').text(this.categoriesName);
        this.bindRenderItemAcrossCPU();
        this.bindRenderItemAcrossRAM();
        this.bindRenderItemAcrossPrice();
        this.bindRenderLaptopAcrossCPU();
        this.bindRenderLaptopAcrossRAM();
    }

    bindRenderAllLogo(listLogo) {
        $('.listBrand').empty();
        listLogo.forEach(function (logo) {
            $('.listBrand').append(`<li><a href="${logo}"><img src="/images/Logo${logo.trim().toUpperCase()}.png" alt="logo"/></a></li>`)
        })

        $('.listBrand li a').click((evt) => {
            evt.preventDefault();
            $('.styleForLogo').removeClass('styleForLogo');
            $(evt.target).parent().addClass('styleForLogo');
            this.bindFilterItem();
        })
    }

    bindRenderAllItem(itemToRender) {
        itemToRender.forEach((item) => {
            if (item.NoiBat === true && $('#itemname li').length <= 3) {
                $('#itemname').append(`<li><a href="${item.DanhMuc}/${item._id}">${item.TenSP}</a></li>`);
            }
            let hinhanh = item.HinhAnh.find(hinhanh => hinhanh.includes('png'));

            let liText = '';
            Object.keys(item.cauhinh[0]).forEach(function (fieldname) {
                if (fieldname === '_id' || fieldname === '__v' || fieldname === 'Kich Thuoc'
                    || fieldname === 'TheNho' || fieldname === 'TheSim' || fieldname === 'ChatLieu'
                    || fieldname === 'Bluetooth' || fieldname === 'DoDaiDay' || fieldname === 'CongSac' || fieldname==='CongKetNoi') {
                    return;
                }

                if (item.cauhinh[0][`${fieldname}`].length > 0) {
                    liText += `<li style="text-transform: uppercase">${fieldname}:   ${item.cauhinh[0][fieldname]}</li>`;
                }
            })

            $('#listitem').append(`
            <li>
                <a href="/${item.DanhMuc}/${item._id}" class="itemProduct">
                    <img src="http://localhost:5000/images/${this.categoriesName}_img/${hinhanh}"  class="${this.categoriesName.toLowerCase()}Img" alt="itemimg">
                    <div class="inforItem">
                        <span class="nameItem">${item.TenSP}</span>
                        <span class="price">
                        ${item.GiaGiam === 0
                            ?`<span class="newPrice">${item.Gia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>`
                            :`<span class="newPrice">${(item.Gia - item.GiaGiam).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            <del class="oldPrice">${item.GiaGiam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>`}
                        </span>
                    </div>
                    <ul class="featureMainProduct">
                            ${liText}
                    </ul>
                </a>
            </li>
            `)
        })
    }

    bindPagination(items) {
        let page = 1;
        let itemToRender = items.slice(5 * (page - 1), 5 * page);
        this.bindRenderAllItem(itemToRender);
        if ((items.length - $('#listitem >li').length) !== 0) {
            $('.loadmore').show().text('Xem them ' + (items.length - $('#listitem >li').length) + ' san pham');
        } else {
            $('.loadmore').hide();
        }

        $('.loadmore').off('click').click((evt) => {
            page = page + 1;
            itemToRender = items.slice(5 * (page - 1), 5 * page);
            this.bindRenderAllItem(itemToRender);
            let soluongspconlai = items.length - $('#listitem > li').length;
            if (soluongspconlai !== 0) {
                $(evt.target).text('Xem them ' + soluongspconlai + ' san pham');
            } else {
                $(evt.target).hide();
            }
        })
    }

    bindSortItem(sortitem) {
        $('.sort select').change((evt) => {
            $('#listitem').empty();
            $('#itemname').empty();
            sortitem(evt.target.value);
        })
    }

    bindRenderItemAcrossPrice() {
        $('.listPriceRange a').click((evt) => {
            evt.preventDefault();
            $('.styleForLinkPrice').removeClass('styleForLinkPrice');
            $(evt.target).addClass('styleForLinkPrice');
            this.bindFilterItem();
        })
    }

    bindRenderItemAcrossRAM() {
        $('.listRAM input[name="ram"]').change((evt) => {
            this.bindFilterItem();
        })
    }

    bindRenderItemAcrossCPU() {
        $('.listCPU input[name="cpu"]').change((evt) => {
            this.bindFilterItem();
        })
    }

    bindRenderLaptopAcrossRAM() {
        $('.listRAM_laptop input[name="ram_laptop"]').click((evt) => {
            this.bindFilterLaptop();
        })
    }

    bindRenderLaptopAcrossCPU() {
        $('.listCPU_laptop input[name="cpu_laptop"]').click((evt) => {
            this.bindFilterLaptop();
        })
    }

    bindFilterItem() {
        $('#listitem').empty();
        $('#itemname').empty();
        let input_namecpu = $('input[name="cpu"]:checked');
        let input_nameram = $('input[name="ram"]:checked');
        let brand = $('.styleForLogo');
        let price = $('.styleForLinkPrice');
        this.onFilterItem(brand, price, input_namecpu, input_nameram);
    }

    bindFilterLaptop() {
        $('#listitem').empty();
        $('#itemname').empty();
        let input_namecpu_laptop = $('input[name="cpu_laptop"]:checked');
        let input_nameram_laptop = $('input[name="ram_laptop"]:checked');
        let brand = $('.styleForLogo');
        let price = $('.styleForLinkPrice');
        this.onFilterItem(brand, price, input_namecpu_laptop, input_nameram_laptop);
    }

    filterItem(onFilterItem) {
        this.onFilterItem = onFilterItem;
    }
}

class Categories_Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.renderAllItem(this.onRenderAllItem);
        this.model.renderAllLogo(this.onRenderAllLogo);
        this.view.bindSortItem(this.onSortItem);
        this.view.filterItem(this.onFilterItem);
    }

    onRenderAllItem = (items) => {
        this.view.bindPagination(items);
    }

    onRenderAllLogo = (listLogo) => {
        this.view.bindRenderAllLogo(listLogo);
    }

    onSortItem = (condition) => {
        this.model.sortItem(condition)
    }

    onFilterItem = (brand, price, cpu, ram) => {
        this.model.filterItem(brand, price, cpu, ram);
    }
}