const mongoose=require('mongoose');

const ManHinh_CH_schema=new mongoose.Schema({
    LoaiManHinh: {
        type: String,
        required: true
    },
    CongNghe: {
        type: Array,
        required: true
    },
    DoSang: {
        type: String,
        required: true
    },
    ThoiGianDapUng: {
        type: String,
        required: true
    },
    CongKetNoi: {
        type: Array,
        required: true
    },
    TanSoQuet: {
        type: String,
        reauired: true
    },
    KichThuoc: {
        Ngang: {type: Number},
        Day: {type: Number},
        Cao: {type: Number}
    },
    TienIch: {
        type: String,
        required: true
    }
})

const ManHinh_CH_model=mongoose.model('manhinh_ch',ManHinh_CH_schema);
module.exports=ManHinh_CH_model;