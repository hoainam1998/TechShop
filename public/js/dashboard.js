$(document).ready(function () {
    class Model {
        constructor() {
            this.listProduct = [];
            $.get('api/all', function (data) {
                this.listProduct = data;
            })
        }

        listProductChanged(callback) {
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
                success: function (success) {
                   if(success===true){
                       this._commit();
                   }
                }
            })


        }

        updateProduct() {
            console.log('update product');
        }

        deleteProduct() {
            console.log('delete product');
        }

        _commit() {
            $.get('/api/create',function(data){
                this.onProductChanged(data);
            })
        }
    }

    class View {
        constructor() { }

        displayProduct(listProduct) { }

        bindAddProduct(handler) {
            $('.submit').click(function (evt) {
                $('.submit').click(function (evt) {
                    evt.preventDefault();
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
                    let form = new FormData($('#dashboardForm')[0]);

                    handler(formdata);
                })
            })
        }

        bindUpdateProduct(hander) { }

        bindDeleteProduct(hander) { }

    }

    class Controller {
        constructor(model, view) {
            this.model = model;
            this.view = view;

            this.onListProductChanged(this.model.listProduct);
            this.model.listProductChanged(this.onListProductChanged);
            this.view.bindAddProduct(this.onAddProduct);
        }

        onListProductChanged = (listProduct) => {
            this.view.displayProduct(listProduct);
        }

        onAddProduct = (product) => {
            this.model.addProduct(product);
        }

        onUpdateProduct = (product) => {
            this.model.updateProduct();
        }

        onDeleteProduct = (idProduct) => {
            this.model.deleteProduct();
        }
    }

    const App = new Controller(new Model(), new View());

    // add event 
    $('.fa-plus-square').click(function () {
        $('.detailItemData').show();
    })

    function addEventforAddBtn(elToAdd) {
        elToAdd.click(function (evt) {
            evt.preventDefault();
            let value = $(this).prev().val();
            elToAdd.next().append(`<li>${value}<i class="far fa-times-circle"></i></li>`);
            addEventForDelBtn();
            $(this).prev().val('');
        })
    }

    function addEventForDelBtn() {
        $('.fa-times-circle').click(function () {
            $(this).parent().remove();
        })
    }

    addEventforAddBtn($('.addDiscount'));
    addEventforAddBtn($('.addAccessories'));

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

    let listtenquakm = [];
    $('.addnameDiscount').click(function () {
        let tenquakm = $('input[name="tenquakm"]').val();
        listtenquakm.push(tenquakm);
        console.log(listtenquakm);
        $('input[name="tenquakm"]').val('')
        $('.listDiscountGift').append(`<li>
                                        <img src="images/1024px-No_image_available.svg.webp" alt="imgDiscount">
                                        <span>${tenquakm}</span>
                                        <input type="file" name="hinhkhuyenmai" style="margin-left:.4rem">
                                    </li>`);
        addEventforInputHinhKM();
    })

    function addEventforInputHinhKM() {
        $('input[name="hinhkhuyenmai"]').change(function () {
            let reader = new FileReader();
            let img = $(this).prev().prev();
            reader.onload = function (evt) {
                img.attr('src', evt.target.result);
            }
            reader.readAsDataURL(this.files[0]);
        })
    }

    // $('.submit').click(function (evt) {
    //     evt.preventDefault();
    //     let tenquakm = [];
    //     let listkhuyenmai = [];
    //     let listphukien = [];

    //     $('.listDiscountGift li span').each(function () {
    //         tenquakm.push($(this).html());
    //     })

    //     $('#listKhuyenMai li').each(function () {
    //         listkhuyenmai.push($(this).text());
    //     })

    //     $('#listphukien li').each(function () {
    //         listphukien.push($(this).text());
    //     })

    //     $('input[name="khuyenmai"]').val(listkhuyenmai);
    //     $('input[name="tenquakm"]').val(tenquakm);
    //     $('input[name="phukien"]').val(listphukien);
    //     let form = new FormData($('#dashboardForm')[0]);
    //     $.ajax({
    //         url: '/api/create',
    //         type: 'POST',
    //         enctype: 'multipart/form-data',
    //         data: form,
    //         cache: false,
    //         processData: false,
    //         contentType: false,
    //         success: function (data) {
    //             console.log(data);
    //         }
    //     })
    // })
})

