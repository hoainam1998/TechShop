const mongoose=require('mongoose');
const PC_Schema=new mongoose.Schema({
    CPU: {
        type: String,
        required: true
    },
    RAM: {
        type: String,
        required: true
    },
    OCung: {
        type: String,
        required: true
    },
    CardManHinh: {
        type: String,
        required: true
    },
    GiaoTiepMang: {
        type: String,
        required: true
    },
    HeDieuHanh: {
        type: String,
        required: true
    },
    ODiaQuang: {
        type: String,
        required: true
    }
})

const PC_model=mongoose.model('PC_ches',PC_Schema);
module.exports=PC_model;