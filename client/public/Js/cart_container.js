class Cart_Container {

    static addProductToCart(product){
        let listProduct=JSON.parse(localStorage.getItem('cart'))||[];
        listProduct=listProduct.filter(productCart=>productCart._id!==product._id);
        listProduct.push(product);
        localStorage.setItem('cart',JSON.stringify(listProduct));
        this.getSize();

    }

    static deleteProductCart(_id){
        let listProduct=JSON.parse(localStorage.getItem('cart'))||[];
        listProduct=listProduct.filter(productCart=>productCart._id!==_id);
        localStorage.setItem('cart',JSON.stringify(listProduct));
        this.getSize();
    }    

    static deleteAllCart(){
        localStorage.removeItem('cart');
        this.getSize();
    }

    static getSize(){
        let listProductCart=JSON.parse(localStorage.getItem('cart'))||[];
        if(listProductCart){
            $('#cartnumber').text(listProductCart.length);
        }
    }
}