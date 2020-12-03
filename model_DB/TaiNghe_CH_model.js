const mongoose=require('mongoose');

const TaiNghe_CH_chema=new mongoose.Schema({
    Bluetooth: {
        type: Boolean,
        required: true,
    },
    CongSac: {
        type: String,
        required: false,
        default: 'Khong co'
    },
    CongNghe: {
        type:Array,
        required: true,
        default: []
    },
    KetNoiCungLuc: {
        type: String,
        required: true
    },
    PhimDieuKhien: {
        type: Array,
        required: true
    },
    DoDaiDay: {
        type: String,
        required: false
    }
})

const TaiNghe_ch=mongoose.model('TaiNghe_ch',TaiNghe_CH_chema);
module.exports=TaiNghe_ch;