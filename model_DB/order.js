const mongoose =require('mongoose');

const Order_Schema=new mongoose.Schema({
    _id:{
        type: String,
        required: true,
    },
    MaKH: {
        type: String,
        required: true
    },
    NgayTao: {
        type: String,
        required: true
    },
    GiamGia: {
        type: Number,
        required: true
    },
    TongTienThanhToan: {
        type: Number,
        required: true
    }
})

const Order=mongoose.model('Orders',Order_Schema);

module.exports=Order;