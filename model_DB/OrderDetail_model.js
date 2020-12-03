const mongoose = require('mongoose');

const OrderDetail_Schema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    TT_SP: [{
        _id: false,
        MaSP: mongoose.Schema.Types.ObjectId,
        SoLuong: Number,
        ThanhTien: Number
    }],
})

const OrderDetail = mongoose.model('OrderDetail', OrderDetail_Schema);

module.exports = OrderDetail;