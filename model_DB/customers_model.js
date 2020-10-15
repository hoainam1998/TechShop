const mongoose=require("mongoose");

const Customers_Chema=new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    HoTen: {
        type: String,
        required: true
    },
    SoDienThoai: {
        type: String,
        required: true
    },
    GioiTinh: {
        type: String,
        required: true
    },
    Tinh_ThanhPho: {
        type: String,
        required: true
    },
    Quan_Huyen: {
        type: String,
        required: true
    },
    Xa_Phuong: {
        type: String,
        required: true,
    },
    Sonha_Tenduong:{
        type: String,
        required: true
    }
})

const Customers=mongoose.model('Customers',Customers_Chema);

module.exports=Customers;