const mongoose=require('mongoose');

const OrderDetail_Schema=new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    TT_SP: {
        type: {
            MaSP: {
                type: String,
                required: true,
            },
            SoLuong: {
                type: String,
                required: true
            },
            ThanhTien: {
                type: Number,
                required: true
            },
            GiaGiam: {
                type: Number,
                required: true
            },
            Phaitra: {
                type: Number,
                required: true
            }
        },
        required: true
    }
})

const OrderDetail=mongoose.model('OrderDetail',OrderDetail_Schema);

module.exports=OrderDetail;