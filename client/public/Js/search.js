class Search_Model {
    renderProductSearch(onRenderProductSearch){
        this.onRenderProductSearch=onRenderProductSearch;
    }

    searchProduct(nameProduct){
        $.get('/api/search/'+nameProduct,(productSearch)=>{
            this.onRenderProductSearch(productSearch);
        })
    }
}

class Search_View {
    bindRenderProductSearch(productSearch){
        $('.listSearch').empty();
        productSearch.forEach(product=>{
            let hinhanh=product.HinhAnh.find(ha=>ha.includes('png'));
            $('.listSearch').append(`
            <li>
                <a href="/${product.DanhMuc}/${product._id}">
                    <img src="http://localhost:5000/images/${product.DanhMuc}_img/${hinhanh}">
                    <div class="quickInforSearch">
                        <h1 class="nameInforSearch">${product.TenSP}</h1>
                        <div class="price">
                            ${
                                product.GiaGiam>0
                                ?`<span class="newPrice">${(product.Gia-product.GiaGiam).toLocaleString('it-IT',{style: 'currency',currency: 'VND'})}</span>
                                <del class="oldPrice">${product.Gia.toLocaleString('it-IT',{style: 'currency',currency: 'VND'})}</del>`
                                :`<span class="newPrice">${product.Gia.toLocaleString('it-IT',{style: 'currency',currency: 'VND'})}</span>`
                                
                            }
                        </div>
                    </div>
                </a>
            </li>
            `)
            $('.listSearch').show(function(){$('.hideListSearch').show()});
        })
    }

    bindSearch(onSearchProduct){
        $('.searchbox').on('click','button[type="submit"]','.fa-search',(evt)=>{
            evt.preventDefault();
            let valueSearch=$('input[name="search"]').val();
            onSearchProduct(valueSearch);
        })
    }
}

class Search_Controller {
    constructor(model,view){
        this.model=model;
        this.view=view;

        this.model.renderProductSearch(this.onRenderProductSearch);
        this.view.bindSearch(this.onSearchProduct);
    }

    onRenderProductSearch=(productSearch)=>{
        this.view.bindRenderProductSearch(productSearch)
    }

    onSearchProduct=(nameProduct)=>{
        this.model.searchProduct(nameProduct);
    }
}