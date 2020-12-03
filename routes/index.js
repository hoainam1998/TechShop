const express=require('express');
const route=express.Router();

route.get('/',(req,res)=>{
    res.render('CRUD_dashboard.ejs');
})

route.get('/uploadImages',(req,res)=>{
    res.render('uploadImage');
})

module.exports=route;