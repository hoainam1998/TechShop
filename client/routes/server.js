const express=require('express');
const route=express.Router();
const fs=require('fs');

route.get('/',(req,res)=>{
    res.render('home.ejs');
})

route.get('/:categories/:id',(req,res,next)=>{
    if(typeof req.params.id==='undefined'){
        next('route')
    }else next();
},
(req,res)=>{
    res.render('product_detail.ejs');
})

route.get('/:categories',(req,res,next)=>{
    if(req.params.categories==='cart'){
        next('route')
    }else next();
},(req,res,next)=>{
    if(req.params.categories==='promotion'){
        next('route');
    }else next()
},(req,res)=>{
    res.render('categories.ejs');
})

route.get('/cart',(req,res)=>{
    res.render('cart.ejs');
})

route.get('/promotion',(req,res)=>{
    res.render('promotion.ejs');
})

module.exports=route;