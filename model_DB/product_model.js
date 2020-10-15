const mongoose=require('mongoose');

const ProductSchema=new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    TenSP: {
        type: String,
        required: true
    },
    Gia: {
        type: Number,
        required: true
    },
    GiaGiam: {
        type: Number,
        required: true
    },
    HinhAnh: {
        type: Array,
        required: true,
    },
    KhuyenMai: [{
        tenKM: String,
    }],
    QuaKhuyenMai: [{
        TenQuaKM: String,
        HinhKhuyenMai: String,
    }],
    PhuKien: [{
        tenPhukien: String
    }],
    BaoHanh: {
        type: Number,
        required: true
    },
    Mota: {
        type: String,
        required: true
    },
    NgayNhap: {
        type: Date,
        default: Date.now
    },
    TenThuongHieu: {
        type: String,
        required: true
    },
    DanhMuc: {
        type: String,
        required: true
    }
})

const Products=mongoose.model('Products',ProductSchema);

module.exports=Products;