const mongoose=require('mongoose');

const DienThoai_CHSchema=new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    ManHinh: {
        type: String,
        required: true
    },
    HDH: {
        type: String,
        required: true
    },
    CameraSau: {
        type: String,
        required: true
    },
    CmeraTruoc: {
        type: String,
        required: true
    },
    CPU: {
        type: String,
        required: true
    },
    RAM: {
        type: String,
        required: true
    },
    BoNhoTrong: {
        type: String,
        required: true
    },
    TheNho:{
        type: String,
        required: true
    },
    TheSim: {
        type: String,
        required: true
    },
    DungLuongPin: {
        type: String,
        required: true
    },
    ChatLieu: {
        type: String,
        required: true
    }
})

const CHDT=mongoose.model('DienThoai_CH',DienThoai_CHSchema);

module.exports=CHDT;