const mongoose=require('mongoose');

const Laptop_CH_Schema=new mongoose.Schema({
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
    ManHinh: {
        type: String,
        required: true
    },
    CardManHinh: {
        type: String,
        required: true
    },
    CongKetNoi: {
        type: String,
        required: true
    },
    HeDieuHanh: {
        type: String,
        required: true
    },
    ThietKe: {
        type: String,
        required: true
    }
})

const Laptop_CH=mongoose.model('Laptop_CH',Laptop_CH_Schema);

module.exports=Laptop_CH;