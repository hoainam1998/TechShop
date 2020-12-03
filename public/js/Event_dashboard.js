class Event_dashboard {
    constructor(danhmuc) {
        this.danhmuc = danhmuc;
        $(`a[href$="${this.danhmuc}"]`).css('background', '#34495e');
        this.addEventForSelectAll();
        this.addEventTenquaKM();
        this.addEventHinhspChange();
        this.addEventforAddBtn($('.addDiscount'));
        this.addEventforAddBtn($('.addAccessories'));
        this.addEventforAddBtn($('.addSoundTech'));
        this.addEventforAddBtn($('.addScreenTech'));
        this.hideFormDetailData();
        this.addEventForCreateProduct();
        this.re_createDetailItemDataForm();
        this.addEventForRadioBluetooth();
        this.addEventForFeatureListItem();
        this.addEventForNoiBatCheckBox();
    }

    re_createDetailItemDataForm() {
        $('li[class$="_ch_input"]').hide();
        this.danhmuc === 'tablet' ? $('.smartphone_ch_input').show() : $(`.${this.danhmuc}_ch_input`).show();
    }

    addEventForCreateProduct() {
        $('#openFormCreate').click(function () {
            console.log('open form');
            $('.detailItemData').show();
            $('.add').show();
            $('input[type="text"]').show().val('').attr('readonly', false);
            $('select').attr('disabled', false);
            $('input[type="file"]').show();
            $('input[type="number"]').val('').attr('readonly',false);
            $('input[type="checkbox"]').attr({'checked': false,'disabled':false});
            $('.create').show();
            $('.update').hide();
            $('.listHinhAnh').empty();
            $('#listKhuyenMai').empty();
            $('#listDiscountGift').empty();
            $('#listphukien').empty();
            $('#listSoundTech').empty();
            $('#listScreenTech').empty();
        })
    }

    hideFormDetailData() {
        $('.hide').click(function (evt) {
            evt.preventDefault();
            $('.detailItemData').hide();
        })
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
            $('.listHinhAnh').empty();
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
            $('#listDiscountGift').append(`<li>
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

    addEventForSelectAll() {
        $('input[name="selectAll"]').change(function () {
            if (this.checked) {
                $('.listData >li').addClass('selectAllDataitem');
            } else {
                $('.listData >li').removeClass('selectAllDataitem');
            }
        })
    }

    addEventForRadioBluetooth() {
        $('[name="congsac"]').parent().hide();
        $('[name="dodaiday"]').parent().hide();
        $('input[name="bluetooth"]').change(function (evt) {
            if ($(evt.target).next().text() === "Bluetooth") {
                $('input[name="bluetooth"]').val('true');
                $('[name="dodaiday"]').parent().hide();
                $('[name="congsac"]').parent().show();
            } else {
                $('input[name="bluetooth"]').val('false');
                $('[name="congsac"]').parent().hide();
                $('[name="dodaiday"]').parent().show();
            }
        });
    }

    addEventForFeatureListItem() {
        $('.listCheckbox li span').click(function (evt) {
            $(evt.target).prev().click();
        })
    }

    addEventForNoiBatCheckBox() {
        let noibat_checkbox = $('input[name="noibat"]');
        noibat_checkbox.next().click(function () {
            noibat_checkbox.click();
        })

        noibat_checkbox.change(function () {
            if (noibat_checkbox.is(':checked')) {
                noibat_checkbox.val(true);
            } else {
                noibat_checkbox.val(false);
            }
        })
    }
}