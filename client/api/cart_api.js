const express=require('express');
const route=express.Router();
const mongoose=require('mongoose');
const Customer=require('../../model_DB/Customers_model');
const OrderDetail = require('../../model_DB/OrderDetail_model');
const Order=require('../../model_DB/Order_model');

route.post('/createKhachHang',async(req,res)=>{
    let newCustomer=await Customer.create(req.body);
    res.send(newCustomer._id);
})

route.post('/createOrder',async(req,res)=>{
    let {id_khachhang, YeuCau, TongTienThanhToan}=req.body;
    let order={
        MaKH: new mongoose.Types.ObjectId(id_khachhang),
        YeuCau: YeuCau,
        TongTienThanhToan: TongTienThanhToan
    }

    let newOrder=await Order.create(order);
    console.log(newOrder);
    res.send(newOrder._id);
})

route.post('/createOrderDetail',async(req,res)=>{
    let{id_order,ttsp}=req.body
    let orderDetail={
        _id: new mongoose.Types.ObjectId(id_order),
        TT_SP: ttsp
    }

    try{
        await OrderDetail.create(orderDetail);
        return res.send(true);
    }catch(err){ res.send(false)}
})

route.delete('/removeAllOrder',async(req,res)=>{
    try{
        await Customer.deleteMany();
        await Order.deleteMany();
        await OrderDetail.deleteMany();
        return res.send(true);
    }catch(err){res.send(false)}
})

module.exports=route;