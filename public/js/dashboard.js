$(document).ready(function () {
    class Model {
        constructor() {
            this.listProduct = [];
            $.get('api/all', function (data) {
                this.listProduct = data;
            })
        }

        productChanged(callback) {
            this.onProductChanged = callback;
        }

        addProduct(product) {
            console.log('add product');
        }

        updateProduct() {
            console.log('update product');
        }

        deleteProduct() {
            console.log('delete product');
        }

        _commit() {
            this.onProductChanged(this.listProduct);
        }
    }

    class View {
        constructor() { }

        displayProduct(listProduct) {

        }

        bindAddProduct(handler) {
            $('.submit').click(function (evt) {
                evt.preventDefault();
                let form = $('#dashboardForm')[0];
                let inforOfProduct = new FormData(form);
                $('#listKhuyenMai li').each(function () { console.log($(this).text()) });
                // handler(inforOfProduct);
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

    // let inputImage = document.querySelector('input[name="images"]');
    // inputImage.onchange = function () {
    //     let dt = new DataTransfer();
    //     for (let file of inputImage.files) {
    //         if (file !== inputImage.files[0]) {
    //             dt.items.add(file);
    //         }
    //     }
    //     inputImage.onchange = null;
    //     inputImage.files = dt.files;
    // }

    // $('.submit').click(function (evt) {
    //     evt.preventDefault();
    //     let formData = new FormData($('#dashboardForm')[0]);
    //     $.ajax({
    //         url: '/upload/uploadImages',
    //         encType: 'multipart/form-data',
    //         type: 'POST',
    //         data: formData,
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //         success: function (data) {
    //             console.log(data);
    //         }
    //     })
    // })

    // $('input[name="hinhsp"]').change(function () {
    //     let data = new DataTransfer();
    //     for (let file of this.files) {
    //         data.items.add(file);
    //     }
    //     this.files = data.files;
    //     console.log(data.files);
    // })

    $('input[name="hinhsp"]').change(function () {
        let fileLength = this.files.length;
        let files=this.files;
        for (let i = 0; i < fileLength; i++) {
            let dataReader = new FileReader();
            dataReader.onload = function (evt) {
                $('.listHinhAnh').append(`<li data-index="${i}">
                                            <img src="${evt.target.result}" alt="product">
                                            <span id="img${i}"><i class="fas fa-times"></i></span>
                                        </li>`);
                                        addEventForBtnDelImage(i,files);
            }
            dataReader.readAsDataURL(this.files[i]);
        }
    })

    function addEventForBtnDelImage(index,fileList) {
        console.log(fileList);
        $('#img'+index).click(function () {
           let indextoDel=($(this).parent().data('index'));
           let dataTransfer=new DataTransfer();
           for(let i=0; i<fileList.length;i++){
               if(fileList[i]!==fileList[indextoDel]){
                dataTransfer.items.add(fileList[i]);
               }
           }
           $(this).parent().remove();
         })
    }
})

function newFunction(addEventForBtnDelImage) {
    addEventForBtnDelImage();
}

