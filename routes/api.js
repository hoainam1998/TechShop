const express=require('express');
const route=express.Router();
const Product=require('../model_DB/product_model');
const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination: './public/images',
    filename: function(req,file,cb){
        cb(null,req.body.tensp+Math.floor(Math.random()*100)+path.extname(file.originalname));
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
    const filetypes=/jpg|jpeg|html/;
    const extname=filetypes.test(path.extname(file.originalname));

    const mimetype=filetypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null,true);
    }else {
        cb('Error: Images only');
    }
}

route.post('/create',upload.fields([
    {name: 'hinhsp',maxCount: 10},
    {name: 'hinhkhuyenmai',maxCount: 10},
    {name: 'mota',maxCount: 1}
]),async(req,res)=>{
    let listhinhsp=[];
    let listquakm=[];
    let listkhuyenmai=req.body.khuyenmai.split(',');
    let tenquakm=req.body.tenquakm.split(',');
    let listphukien=req.body.phukien.split(',');

    for(let i=0; i<tenquakm.length;i++){
        let itemKhuyenmai={
            TenQuaKM: tenquakm[i],
            HinhKhuyenMai: req.files.hinhkhuyenmai[i].filename
        }
        listquakm.push(itemKhuyenmai);
    }

    req.files.hinhsp.forEach(item=>listhinhsp.push(item.filename));

    let product={
        _id: req.body.tensp,
        TenSP: req.body.tensp,
        Gia: parseInt(req.body.gia),
        GiaGiam: parseInt(req.body.giagiam),
        HinhAnh: listhinhsp,
        KhuyenMai: listkhuyenmai,
        QuaKhuyenMai: listquakm,
        PhuKien: listphukien,
        Mota: req.files.mota[0].filename,
        BaoHanh: parseInt(req.body.baohanh),
        TenThuongHieu: req.body.thuonghieu,
        DanhMuc: req.body.danhmuc
    }

    if( typeof await Product.create(product)!=='undefined'){
        return res.send(true);
    }
    res.send(false);
})

route.get('/all',async (req,res)=>{
   let listProduct= await Product.find({});
   res.json(listProduct);
})

route.post('/test',upload.array('hinhkhuyenmai',10),(req,res)=>{
    if(req.files){
        let strfilename='';
        for(let i=0;i<req.files.length;i++){
            console.log(req.files[i].filename);
            strfilename+=req.files[i].filename;
        }
        return res.send(strfilename);
    }
    res.send('err');
})

route.post('/upload',upload.array('images',10),(req,res)=>{
    if(req.file){
        return res.send(`images/${req.file.filename}`);
    }
    res.send('err');
})

module.exports=route;