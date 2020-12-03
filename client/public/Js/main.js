new Search_Controller(new Search_Model(), new Search_View());

Cart_Container.getSize();

let pathname=location.pathname.split('/');
pathname.splice(0,1);

console.log(pathname[0]);
$.get('/api/home/distinct',(data)=>{
    if(pathname[0]===''){
        console.log('home');
        new Home_Controller(new Home_Model(), new Home_View())
    }else if(data.DanhMuc.includes(pathname[0])&& data.ID.includes(pathname[1])){
        console.log('product');
        new Product_Controller(new Product_Model(), new Product_View());
    }else if(data.DanhMuc.includes(pathname[0])) {
        console.log('categories');
        new Categories_Controller(new Categories_Model(), new Categories_View());
    }else if( pathname[0]==='cart'){
        new Cart_Controller(new Cart_Model(),new Cart_View());
    }
})

