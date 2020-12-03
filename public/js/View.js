class View {
    constructor() { }

    paginationObj = new Pagination(this);

    getCategories(danhmuc) {
        this.danhmuc = danhmuc;
    }

    bindAddProduct(handler) {
        $('.create').click((evt) => {
            evt.preventDefault();
            let formdata = this.getDataFromFormData();;

            handler(formdata);
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

    bindUpdateProduct(handlerUpdateProduct) {
        $('.update').click((evt) => {
            evt.preventDefault();
            let idProduct = $(evt.target).attr('id');
            let formdata = this.getDataFromFormData();
            handlerUpdateProduct(idProduct, formdata);
        });
    }

    readProduct(callback) {
        this.onReadProduct = callback;
    }

    readProductForUpdate(callback) {
        this.onReadProductForUpdate = callback;
    }

    getDataFromFormData() {
        let tenquakm = [];
        let listkhuyenmai = [];
        let listphukien = [];
        let listCongNghe = [];
        let listCongNgheMH = [];
        let listFeatureInput = [];
        let listConnectPorts = [];

        $('#listDiscountGift li span').each(function () {
            tenquakm.push($(this).html());
        })

        $('#listKhuyenMai li').each(function () {
            listkhuyenmai.push($(this).text());
        })

        $('#listphukien li').each(function () {
            listphukien.push($(this).text());
        })

        $('#listSoundTech li').each(function () {
            listCongNghe.push($(this).text())
        })

        $('#listScreenTech li').each(function () {
            listCongNgheMH.push($(this).text())
        })

        $('#listFeatureInput li input').each(function () {
            if ($(this).is(':checked')) {
                listFeatureInput.push($(this).val())
            }
        })

        console.log(listFeatureInput);

        $('#listConnectPortInput li input').each(function () {
            if ($(this).is(':checked')) {
                listConnectPorts.push($(this).val());
            }
        })

        $('input[name="khuyenmai"]').val(listkhuyenmai);
        $('input[name="tenquakm"]').val(tenquakm);
        $('input[name="phukien"]').val(listphukien);
        $('input[name="congngheamthanh"]').val(listCongNghe);

        let formdata = new FormData($('#dashboardForm')[0]);
        formdata.append('congnghemanhinh', listCongNgheMH);
        formdata.append('phimdieukhien', listFeatureInput);
        formdata.append('congketnoi', listConnectPorts);

        return formdata;
    }

    showDetailProductToRead(product) {
        let cauhinh = product.cauhinh[0];
        $('#listphukien').empty();
        $('#listDiscountGift').empty();
        $('#listKhuyenMai').empty();
        $('.listHinhAnh').empty();
        $('#listSoundTech').empty();
        $('#listScreenTech').empty();
        $('.addnameDiscount').hide();
        $('.add').hide();
        $('input[name="mota"]').hide();
        $('input[name="hinhsp"]').hide();
        $('input[name="khuyenmai"]').hide();
        $('input[name="phukien"]').hide();
        $('input[name="tenquakm"]').hide();
        $('input[name="congngheamthanh"]').hide();
        $('.submit').hide();
        $('input[name="tensp"]').val(product.TenSP).attr('readonly', true);
        $('input[name="gia"]').val(product.Gia).attr('readonly', true);
        $('input[name="giagiam"]').val(product.GiaGiam).attr('readonly', true);
        $('input[name="soluong"]').val(product.SoLuong).attr('readonly', true);
        $('#baohanh').val(product.BaoHanh).attr('disabled', true);
        $('input[name="thuonghieu"]').val(product.TenThuongHieu).attr('readonly', true);
        $('input[name="danhmuc"]').val(product.DanhMuc).attr('readonly', true);
        if (product.NoiBat === true) {
            $('input[name="noibat"]').attr({ 'checked': true, 'disabled': true });
        } else {
            $('input[name="noibat"]').attr({ 'checked': false, 'disabled': true });
        }

        switch (product.DanhMuc) {
            case 'SmartPhone': {
                Object.keys(cauhinh).forEach(fieldname => {
                    if (fieldname === '_id' || fieldname === '__v') {
                        return;
                    }
                    let inputField = $(`[name="${fieldname.toLowerCase()}"]`);
                    inputField.val(cauhinh[`${fieldname}`]);

                    if (inputField.is('input')) {
                        inputField.attr('readonly', true)
                    } else if (inputField.is('select')) {
                        inputField.attr('disabled', true)
                    }
                })
            }; break;
            case 'Laptop': {
                Object.keys(cauhinh).forEach(fieldname => {
                    if (fieldname === "_id" || fieldname === "__v") {
                        return;
                    }

                    let inputField = $(`[name="laptop_${fieldname.toLowerCase()}"]`);
                    inputField.val(cauhinh[`${fieldname}`]);

                    if (inputField.is('select')) {
                        inputField.attr('disabled', true);
                    } else if (inputField.is('input')) {
                        inputField.attr('readonly', true);
                    }
                })
            }; break;

            case 'Tablet': {
                Object.keys(cauhinh).forEach(fieldname => {
                    if (fieldname === '_id' || fieldname === '__v') {
                        return;
                    }
                    let inputField = $(`[name="${fieldname.toLowerCase()}"]`);
                    inputField.val(cauhinh[`${fieldname}`]);

                    if (inputField.is('input')) {
                        inputField.attr('readonly', true)
                    } else if (inputField.is('select')) {
                        inputField.attr('disabled', true)
                    }
                })
            }; break;
            case 'TaiNghe': {
                if (cauhinh.Bluetooth === true) {
                    $('#bluetooth').click().attr('disabled', true);
                } else {
                    $('#coday').click().attr('disabled', true);
                }

                $('[name="congsac"]').val(cauhinh.CongSac).attr('disabled', true);
                $('[name="dodaiday"]').val(cauhinh.DoDaiDay).attr('disabled', true);
                $('[name="ketnoicungluc"]').val(cauhinh.KetNoiCungLuc).attr('disabled', true);

                if (cauhinh.CongNghe.includes('') === false) {
                    cauhinh.CongNghe.forEach(function (congngheamthanh) {
                        $('#listSoundTech').append(`<li>${congngheamthanh}</li>`)
                    })
                }

                if (cauhinh.PhimDieuKhien.length > 0) {
                    cauhinh.PhimDieuKhien.forEach(function (phimdieukhien) {
                        $(`[value="${phimdieukhien}"]`).attr({ 'checked': true, 'disabled': true });
                    })
                }
            }; break;
            case 'PC': {
                Object.keys(cauhinh).forEach(fieldname => {
                    if (fieldname === '_id' || fieldname === '__v') {
                        return;
                    }

                    $(`[name="pc_${fieldname.toLowerCase()}"]`).val(cauhinh[`${fieldname}`]).attr('readonly', true);
                })
            }; break;
            case 'ManHinh': {
                $('[name="loaimanhinh"]').val(cauhinh.LoaiManHinh).attr('disabled', true);
                $('[name="dosang"]').val(cauhinh.DoSang).attr('disabled', true);
                $('[name="thoigiandapung"]').val(cauhinh.ThoiGianDapUng).attr('disabled', true);

                cauhinh.CongKetNoi.forEach(congketnoi => {
                    $(`[value="${congketnoi}"]`).attr({ 'checked': true, 'disabled': true });
                })

                $('[name="tansoquet"]').val(cauhinh.TanSoQuet).attr('disabled', true);
                $('[name="tienich"]').val(cauhinh.TienIch).attr('disabled', true);
                if (cauhinh.CongNghe.length > 0) {
                    cauhinh.CongNghe.forEach(congnghe => {
                        $('#listScreenTech').append(`<li>${congnghe}</li>`);
                    })
                }

                Object.keys(cauhinh.KichThuoc).forEach(kickthuoc => {
                    $(`[name="${kickthuoc.toLowerCase()}"]`).val(cauhinh.KichThuoc[`${kickthuoc}`]).attr('readonly', true);
                })
            }; break;
        }

        for (let hinhsp of product.HinhAnh) {
            $('.listHinhAnh').append(`<li><img src="../images/${this.danhmuc}_img/${hinhsp}" alt="imgProduct" /></li>`);
        }

        if (product.KhuyenMai.length > 0 && product.KhuyenMai.includes('') === false) {
            for (let km of product.KhuyenMai) {
                $('#listKhuyenMai').append(`<li>${km}<i class="far fa-times-circle" style="display: none"></i></li>`);
            }
        }

        if (product.QuaKhuyenMai.length > 0) {
            for (let tenquakm of product.QuaKhuyenMai) {
                $('#listDiscountGift').append(`<li>
                                <img src="../images/${this.danhmuc}_img/${tenquakm.HinhKhuyenMai}" alt="imgProduct" />
                                <span>${tenquakm.TenQuaKM}</span>
                            </li>`);
            }
        }

        for (let phukien of product.PhuKien) {
            $('#listphukien').append(`<li>${phukien}</li>`);
        }
    }

    showDetailProductToUpdate(product) {
        let cauhinh = product.cauhinh[0];
        $('#listphukien').empty();
        $('#listDiscountGift').empty();
        $('#listKhuyenMai').empty();
        $('#listScreenTech').empty();
        $('#listSoundTech').empty();
        $('.listHinhAnh').empty();
        $('.submit').show();

        $('input[name="mota"]').show().val('');
        $('input[name="hinhsp"]').show().val('');
        $('input[name="khuyenmai"]').show().val('');
        $('input[name="phukien"]').show().val('');
        $('input[name="tenquakm"]').show().val('');

        $('input[name="tensp"]').val(product.TenSP).attr('readonly', false);
        $('input[name="gia"]').val(product.Gia).attr('readonly', false);
        $('input[name="giagiam"]').val(product.GiaGiam).attr('readonly', false);
        $('input[name="soluong"]').val(product.SoLuong).attr('readonly', false);
        $('#baohanh').val(product.BaoHanh).attr('disabled', false);
        $('input[name="thuonghieu"]').val(product.TenThuongHieu).attr('readonly', false);
        $('input[name="danhmuc"]').val(product.DanhMuc).attr('readonly', false);
        if (product.NoiBat === true) {
            $('input[name="noibat"]').attr({ 'checked': true, 'disabled': false });
        } else {
            $('input[name="noibat"]').attr({ 'checked': false, 'disabled': false });
        }

        product.HinhAnh.forEach(hinhsp => {
            $('.listHinhAnh').append(`<li><img src="../images/${this.danhmuc}_img/${hinhsp}" alt="imgProduct" /></li>`)
        })

        if (product.KhuyenMai.length > 0 && product.KhuyenMai.includes('') === false) {
            product.KhuyenMai.forEach(khuyenmai => {
                $('#listKhuyenMai').append(`<li>${khuyenmai}<i class="far fa-times-circle" onclick="this.parentNode.remove()"></i></li>`)
            })
        }

        product.PhuKien.forEach(phukien => {
            $('#listphukien').append(`<li>${phukien}<i class="far fa-times-circle" onclick="this.parentNode.remove()"></i></li>`)
        })

        if (product.QuaKhuyenMai.length > 0) {
            product.QuaKhuyenMai.forEach(quakm => {
                $('#listDiscountGift').append(
                    `<li>
                        <img src="../images/${this.danhmuc}_img/${quakm.HinhKhuyenMai}" alt="imgProduct" />
                        <span>${quakm.TenQuaKM}</span>
                        <input type="file" name="hinhkhuyenmai" style="margin-left:.4rem">
                    </li>`)
            })

            $('input[name="hinhkhuyenmai"]').change(function () {
                let fileReader = new FileReader();
                let img = $(this).prev().prev();
                fileReader.onload = function (evt) {
                    img.attr('src', evt.target.result);
                }

                fileReader.readAsDataURL(this.files[0]);
            })
        }

        switch (product.DanhMuc) {
            case 'SmartPhone': {
                Object.keys(cauhinh).forEach(fieldname => {
                    if (fieldname === '_id' || fieldname === '__v') {
                        return;
                    }

                    let inputField = $(`[name="${fieldname.toLowerCase()}"]`);
                    inputField.val(cauhinh[`${fieldname}`]);

                    if (inputField.is('input')) {
                        inputField.attr('readonly', false);
                    } else if (inputField.is('select')) {
                        inputField.attr('disabled', false);
                    }
                })
            }; break;
            case 'Laptop': {
                Object.keys(cauhinh).forEach(function (fieldname) {
                    if (fieldname === '_id' || fieldname === '__v') {
                        return;
                    }

                    let inputField = $(`[name="laptop_${fieldname.toLowerCase()}"]`)
                    inputField.val(cauhinh[`${fieldname}`]);

                    if (inputField.is('select')) {
                        inputField.attr('disabled', false);
                    } else if (inputField.is('input')) {
                        inputField.attr('readonly', false);
                    }
                })
            }; break;
            case 'Tablet': {
                Object.keys(cauhinh).forEach(fieldname => {
                    if (fieldname === '_id' || fieldname === '__v') {
                        return;
                    }

                    let inputField = $(`[name="${fieldname.toLowerCase()}"]`);
                    inputField.val(cauhinh[`${fieldname}`]);

                    if (inputField.is('input')) {
                        inputField.attr('readonly', false);
                    } else if (inputField.is('select')) {
                        inputField.attr('disabled', false);
                    }
                })
            }; break;
            case 'TaiNghe': {
                if (cauhinh.Bluetooth === true) {
                    $('#bluetooth').click().attr('disabled', false);
                } else {
                    $('#coday').click().attr('disabled', false);
                }

                $('[name="congsac"]').val(cauhinh.CongSac).attr('disabled', false);
                $('[name="dodaiday"]').val(cauhinh.DoDaiDay).attr('disabled', false);
                $('[name="ketnoicungluc"]').val(cauhinh.KetNoiCungLuc).attr('disabled', false);

                if (cauhinh.CongNghe.includes('') === false) {
                    cauhinh.CongNghe.forEach(function (congngheamthanh) {
                        $('#listSoundTech').append(`<li>${congngheamthanh}<i class="far fa-times-circle" onclick="this.parentNode.remove()"></i></li>`)
                    })
                }

                if (cauhinh.PhimDieuKhien.length > 0) {
                    cauhinh.PhimDieuKhien.forEach(function (phimdieukhien) {
                        $(`[value="${phimdieukhien}"]`).attr({ 'checked': true, 'disabled': false });
                    })
                }
            }; break;
            case 'PC': {
                Object.keys(cauhinh).forEach(fieldname => {
                    if (fieldname === '_id' || fieldname === '__v') {
                        return;
                    }

                    $(`[name="pc_${fieldname.toLowerCase()}"]`).val(cauhinh[`${fieldname}`]).attr('readonly', false);
                })
            }; break;
            case 'ManHinh': {
                $('[name="loaimanhinh"]').val(cauhinh.LoaiManHinh).attr('disabled', false);
                $('[name="dosang"]').val(cauhinh.DoSang).attr('disabled', false);
                $('[name="thoigiandapung"]').val(cauhinh.ThoiGianDapUng).attr('disabled', false);

                cauhinh.CongKetNoi.forEach(congketnoi => {
                    $(`[value="${congketnoi}"]`).attr({ 'checked': true, 'disabled': false });
                })

                $('[name="tansoquet"]').val(cauhinh.TanSoQuet).attr('disabled', false);
                $('[name="tienich"]').val(cauhinh.TienIch).attr('disabled', false);
                if (cauhinh.CongNghe.length > 0 && cauhinh.CongNghe.includes('') === false) {
                    cauhinh.CongNghe.forEach(congnghe => {
                        $('#listScreenTech').append(`<li>${congnghe}<i class="far fa-times-circle" onclick="this.parentNode.remove()"></i></li>`);
                    })
                }

                Object.keys(cauhinh.KichThuoc).forEach(kickthuoc => {
                    $(`[name="${kickthuoc.toLowerCase()}"]`).val(cauhinh.KichThuoc[`${kickthuoc}`]).attr('readonly', false);
                })
            }; break;
        }
    }
}