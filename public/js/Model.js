class Model {
    constructor(danhmuc) {
        this.danhmuc=danhmuc;
        this._commit();
    }

    getPaginationObj(paginationObj){
        this.paginationObj=paginationObj;
    }
    
    showDetailProductToRead(callback) {
        this.showDetailProductToRead = callback;
    }

    showDetailProductToUpdate(callback) {
        this.showDetailProductToUpdate = callback;
    }

    addProduct(formdata) {
        $.ajax({
            url: `/api/${this.danhmuc}/create`,
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

    updateProduct(id, formdata) {
        $.ajax({
            url: `/api/${this.danhmuc}/update/${id}`,
            type: 'PUT',
            data: formdata,
            enctype: 'multipart/form-data',
            cache: false,
            processData: false,
            contentType: false,
            success: (success) => {
                if (success) { this._commit(); }
            }
        })
    }

    deleteAllProduct() {
        $.ajax({
            url: `/api/${this.danhmuc}/deleteAll`,
            type: 'DELETE',
            success: (success) => {
                if (success) { this._commit(); }
            }
        })
    }

    deleteSpecixProduct(listIdProduct) {
        listIdProduct.forEach(itemId => {
            $.ajax({
                url: `/api/${this.danhmuc}/delete/${itemId}`,
                type: 'DELETE',
                success: (data) => {
                     if (data) { this._commit(); }
                }
            })
        })
    }

    getProductToRead(idProduct) {
        $.get(`/api/${this.danhmuc}/get/${idProduct}`, (data) => {
            this.showDetailProductToRead(data[0]);
        })
    }

    getProductToUpdate(idProduct) {
        $.get(`/api/${this.danhmuc}/get/${idProduct}`, (data) => {
            this.showDetailProductToUpdate(data[0]);
        })
    }

    searchProduct(nameProduct) {
        $.get(`/api/${this.danhmuc}/search/${nameProduct}`, (data) => {
            this.paginationObj.pagination(data);
        })
    }

    _commit() {
        $.get(`/api/${this.danhmuc}/all`, (data) => {
            this.paginationObj.pagination(data);
        })
    }
}

