const mongoose =require('mongoose');

const Order_Schema=new mongoose.Schema({
    MaKH: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    YeuCau: {
        type: String,
        required: false
    },
    NgayTao: {
        type: Date,
        default: Date.now
    },
    TongTienThanhToan: {
        type: Number,
        required: true
    }
})

const Order=mongoose.model('Orders',Order_Schema);

module.exports=Order;