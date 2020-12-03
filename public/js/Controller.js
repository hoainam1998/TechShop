class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.getCategories(this.model.danhmuc);
        this.model.getPaginationObj(this.view.paginationObj);
        this.model.showDetailProductToRead(this.onShowDetailProductToRead);
        this.model.showDetailProductToUpdate(this.onShowDetailProductToUpdate);
        this.view.bindAddProduct(this.onAddProduct);
        this.view.bindDeleteProduct(this.onDeleteAllProduct, this.onDeleteSpecixProduct);
        this.view.bindSearchProduct(this.onSearchProduct);
        this.view.readProduct(this.onReadProduct);
        this.view.bindUpdateProduct(this.onUpdateProduct);
        this.view.readProductForUpdate(this.onReadProductForUpdate);
    }

    onShowDetailProductToRead = (product) => {
        this.view.showDetailProductToRead(product);
    }

    onShowDetailProductToUpdate = (product) => {
        this.view.showDetailProductToUpdate(product);
    }

    onReadProduct = (idProduct) => {
        this.model.getProductToRead(idProduct);
    }

    onReadProductForUpdate = (idProduct) => {
        this.model.getProductToUpdate(idProduct)
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