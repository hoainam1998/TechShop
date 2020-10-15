const mongoose=require('mongoose');

const Test_Schema=new mongoose.Schema({
    field1:{
        type: String,
        required: true
    },
    field2: {
        type: String,
        required: true
    }
})

const Test=mongoose.model('Tests',Test_Schema);

module.exports=Test;