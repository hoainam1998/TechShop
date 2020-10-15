const express=require('express');
const route=express.Router();
const Product=require('../model_DB/product_model');
const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination: './public/images',
    filename: function(req,file,cb){
        cb(null,req.body.tensp+path.extname(file.originalname));
    }
})

const upload=multer({
    storage: storage,
    limits: {fileSize: 100000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
})

function checkFileType(file,cb){
    const filetypes=/jpg|jpeg|html/;
    const extname=filetypes.test(path.extname(file.originalname));

    const mimetype=filetypes.test(file.mimetype);
    console.log(file.mimetype+' '+path.extname(file.originalname));

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
]),(req,res)=>{
    let listhinhsp=[];
    let listquakm=[];
    
    for(let i=0; i<req.body.tenquakm.length;i++){
        let itemKhuyenmai={
            TenQuaKM: req.body.tenquakm[i],
            HinhKhuyenMai: req.files.hinhkhuyenmai[i]
        }
        listquakm.push(itemKhuyenmai);
    }

    req.files.hinhsp.forEach(item=>listhinhsp.push(item.filename));

    let product={
        TenSP: req.body.tensp,
        Gia: parseInt(req.body.gia),
        GiaGiam: parseInt(req.body.giagiam),
        HinhAnh: listhinhsp,
        KhuyenMai: req.body.khuyenmai,
        QuaKhuyenMai: listquakm,
        PhuKien: req.body.phukien,
        BaoHanh: parseInt(req.body.baohanh),
        Mota: req.files.mota[0].filename,
        TenThuongHieu: req.body.thuonghieu,
        DanhMuc: req.body.danhmuc
    }

    Product.create(product,function(){
        return res.send(true)
    })
    res.send(false);
})

route.get('/all',async (req,res)=>{
   let listProduct= await Product.find({});
   res.json(listProduct);
})

route.post('/upload',upload.array('images',10),(req,res)=>{
    if(req.file){
        return res.send(`images/${req.file.filename}`);
    }
    res.send('err');
})

module.exports=route;