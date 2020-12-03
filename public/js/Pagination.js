class Pagination {
    constructor(view){
        this.view=view;
    }

    row_per_page = 5;
    pagination_visible_page=4;

    pagination(all_data) {
        console.log(all_data);
        let encode_data = window.btoa(unescape(encodeURIComponent(JSON.stringify(all_data))));
        let total_page = Math.ceil(all_data.length / this.row_per_page);
        $('.pagination').empty();
        $('.pagination').append(`<li>Total pages: ${total_page}</li>`);
        let pager = `<li id="prev_link"><a href="#">&laquo</a></li>` +
            `<li class="active" style="display: block"><a href="#" >1</a></li>`;
        if (total_page < this.pagination_visible_page) {
            this.render_table_rows(encode_data, 1);
            for (let num = 2; num <= total_page; num++) {
                pager += `<li style="display: block"><a href="#">${num}</a></li>`
            }
        } else {
            this.render_table_rows(encode_data, 1);
            for (let num = 2; num <= this.pagination_visible_page; num++) {
                pager += `<li style="display: block"><a href="#">${num}</a></li>`
            }

            for (let num = this.pagination_visible_page + 1; num <= total_page; num++) {
                pager += `<li style="display:none"><a href="#">${num}</a></li>`
            }
        }
        pager += `<li id="next_link"><a href="#" >&raquo</a></li>`
        $('.pagination').append(pager);
        this.addEventForButtonPages(encode_data);
    }

    addEventForButtonPages = (encode_data) => {
        $('.pagination li').click((evt) => {
            this.active_page($(evt.target).parent(), encode_data);
        })

        $('#prev_link').off('click').click(() => {
            this.active_page('prev', encode_data);
        })

        $('#next_link').off('click').click(() => {
            this.active_page('next', encode_data);
        })

        $('.pagination li a').click(function(evt){
            evt.preventDefault();
        })
    }

    hide_from_beginning(element) {
        if (element.css('display') === '' || element.css('display') === 'block') {
            element.css('display', 'none');
         } else {
            this.hide_from_beginning(element.next());
        }
    }

    hide_from_end(element) {
        if (element.css('display') === '' || element.css('display') === 'block') {
            element.css('display', 'none');
        } else {
            this.hide_from_end(element.prev());
        }
    }

    active_page(element, all_data) {
        let current_page = $('.active');
        let next_link = $('#next_link');
        let prev_link = $('#prev_link');
        let next_tab = current_page.next();
        let prev_tab = current_page.prev();
        $('.active').removeClass('active');
        if (element === 'next') {
            if (parseInt(next_tab.text()).toString() === 'NaN') {
                next_tab.prev().addClass('active');
                next_tab.attr('onclick','return false');
            } else {
                next_tab.addClass('active');
                this.render_table_rows(all_data, parseInt(next_tab.text()));

                if (prev_link.attr('onclick') === 'return false') {
                    prev_link.removeAttr('onclick');
                    prev_link.off().click(() => {
                        this.active_page('prev', all_data);
                    })
                }

                if (next_tab.css('display') === 'none') {
                    next_tab.css('display','block');
                    this.hide_from_beginning(prev_link.next())
                }
            }
        } else if (element === 'prev') {
            if (parseInt(prev_tab.text()).toString() === 'NaN') {
                prev_tab.next().addClass('active');
                prev_tab.attr('onclick','return false')
            } else {
                prev_tab.addClass('active');
                this.render_table_rows(all_data, parseInt(prev_tab.text()));

                if (next_link.attr('onclick') === 'return false') {
                    next_link.removeAttr('onclick');
                    next_link.off().click(() => {
                        this.active_page('next', all_data);
                    })
                }

                if (prev_tab.css('display') === 'none') {
                    prev_tab.css('display', 'block');
                    this.hide_from_end(next_link.prev());
                }
            }
        } else {
            element.addClass('active');
            this.render_table_rows(all_data, parseInt(element.text()))
            if (prev_link.attr('onclick') === 'return false') {
                next_link.removeAttr('onclick');
                prev_link.click(() => {
                    this.active_page('prev', all_data);
                })
            }

            if (next_link.attr('onclick') === 'return false') {
                next_link.removeAttr('onclick');
                next_link.click(() => {
                    this.active_page('next', all_data);
                })
            }
        }
    }

    render_table_rows(rows, page_no) {
        let all_data = JSON.parse(window.atob(rows));
        let resp = all_data.slice(this.row_per_page * (page_no - 1), (this.row_per_page * page_no));
        this.displayProduct(resp);
    }

    displayProduct(listProduct) {
        $('.listData').empty();
        listProduct.forEach(product => {
            let hinhanh=product.HinhAnh.find(function(hinhanh){
                return hinhanh.includes('png');
            })
            $('.listData').append(`<li><a href="#" id="${product._id}" class="itemDataProduct"><ul class="listField"></ul</a></li>`);
            let stringData = `<li><img src="/images/${this.view.danhmuc}_img/${hinhanh}" alt="imgProduct"> </li>
                                <li>${product.TenSP}</li>
                                <li>${product.Gia.toLocaleString('it-IT',{style: 'currency',currency: 'VND'})}</li>
                                <li>${product.GiaGiam.toLocaleString('it-IT',{style: 'currency',currency: 'VND'})}</li>
                                <li>${product.SoLuong}</li>
                                <li>${product.BaoHanh} tháng</li>
                                <li><button class="btn_read" style="margin-right: 7px;"></button><button class="btn_update"></button></li>`
            $(`#${product._id} .listField`).append(stringData);
        })
        this.addEventForDataItemSelected();
        this.addEventForReadProduct();
        this.addEventForUpdateProduct();
    }

    addEventForReadProduct() {
        $('.btn_read').click((evt) => {
            $('.detailItemData').show();
            $('input[name="khuyenmai"]').hide();
            $('input[name="tenquakm"]').hide();
            $('input[name="phukien"]').hide();
            $('input[name="noibat"]').attr({'checked':false,'disabled': false});
            $('.add').hide();
            $('.addnameDiscount').hide();
            $('#dashboardForm input[type="file"]').hide();
            $('.create').hide();
            $('.update').hide();
            let id = $(evt.target).parents('.itemDataProduct').attr('id');
            this.view.onReadProduct(id);
        })
    }

    addEventForUpdateProduct() {
        $('.btn_update').click((evt) => {
            let id = $(evt.target).parents('.itemDataProduct').attr('id');
            $('.detailItemData').show();
            $('select').attr('disabled',false);
            $('input[name="congngheamthanh"]').show();
            $('input[name="noibat"]').attr({'checked':false,'disabled': false});
            $('.add').show();
            $('.addnameDiscount').show();
            $('.create').hide();
            $('.update').show().attr('id', id);
            $('.listHinhAnh').empty();
            $('#listKhuyenMai').empty();
            $('#listDiscountGift').empty();
            $('#listphukien').empty();
            this.view.onReadProductForUpdate(id);
        })
    }

    addEventForDataItemSelected() {
        $('.itemDataProduct').click(function (evt) {
            evt.preventDefault();
            $(this).parent().toggleClass('selectAllDataitem');
        })
    }
}