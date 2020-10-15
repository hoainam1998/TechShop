const express=require('express');
const route=express.Router();
const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination: './public/images',
    filename: function(req,file,cb){
        cb(null,req.body.nameImage+(Math.random()*10)+path.extname(file.originalname));
    }
})

const upload=multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
})

function checkFileType(file,cb){
    const filetypes=/jpg|jpeg/;
    const extname=filetypes.test(path.extname(file.originalname));

    const mimetype=filetypes.test(file.mimetype);
    console.log(file.mimetype+' '+path.extname(file.originalname));

    if(extname && mimetype){
        cb(null,true);
    }else {
        cb('Error: Images only');
    }
}

route.post('/uploadImages',
upload.array('images',10),
(req,res)=>{
    if(req.body){
        console.log(req.body.nameImage);
        return res.send(`images/${req.files[0].filename} images/${req.files[1].filename}`);
    }
    res.send('err');
})

module.exports=route;