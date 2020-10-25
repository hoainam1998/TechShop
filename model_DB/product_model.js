const mongoose=require('mongoose');

const ProductSchema=new mongoose.Schema({
    TenSP: {
        type: String,
        required: true,
        text: true
    },
    Gia: {
        type: Number,
        required: true
    },
    GiaGiam: {
        type: Number,
        required: true
    },
    SoLuong: {
        type: Number,
        required: true
    },
    HinhAnh: {
        type: Array,
        required: true,
    },
    KhuyenMai: [{
        _id: false,
        type: String,
    }],
    QuaKhuyenMai: [{
        _id: false,
        TenQuaKM: String,
        HinhKhuyenMai: String,
    }],
    PhuKien: [{
        _id: false,
        type: String
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