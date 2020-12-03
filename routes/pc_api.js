const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const PC = require('../model_DB/Product_model');
const PC_CH = require('../model_DB/PC_CH_model');

const storage = multer.diskStorage({
    destination: './public/images/pc_img',
    filename: function (req, file, cb) {
        cb(null, req.body.tensp + ' ' + Math.floor(Math.random() * 1000000) + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

function checkFileType(file, cb) {
    const filetypes = /png|jpg|jpeg|html|webp/;
    const extname = filetypes.test(path.extname(file.originalname));
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Errors : File not match');
    }
}

route.get('/search/:name', async (req, res) => {
    let listSp = await PC.aggregate([
        { $match: { $text: { $search: req.params.name.toLowerCase() } } },
        {
            $lookup: {
                from: 'pc_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ]);
    res.json(listSp);
})

route.get('/get/:id', async (req, res) => {
    let product = await PC.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'pc_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ]);
    res.json(product);
})

route.get('/all', async (req, res) => {
    let list_pc = await PC.find({ DanhMuc: 'PC' });
    res.json(list_pc);
})

route.post('/create', upload.fields([
    { name: 'hinhsp', maxCount: 10 },
    { name: 'hinhkhuyenmai', maxCount: 10 },
    { name: 'mota', maxCount: 10 }
]),
async (req, res) => {
        let listhinhsp = [];
        let listquakm = [];
        let listkhuyenmai = req.body.khuyenmai.split(',');
        let tenquakm = req.body.tenquakm.split(',');
        let listphukien = req.body.phukien.split(',');

        try {
            for (let i = 0; i < tenquakm.length; i++) {
                let itemKhuyenmai = {
                    TenQuaKM: tenquakm[i],
                    HinhKhuyenMai: req.files.hinhkhuyenmai[i].filename
                }
                listquakm.push(itemKhuyenmai);
            }
        } catch (err) { console.log('khong co qua km') }

        req.files.hinhsp.forEach(item => listhinhsp.push(item.filename));

        let product = {
            TenSP: req.body.tensp.trim(),
            Gia: parseInt(req.body.gia),
            GiaGiam: parseInt(req.body.giagiam),
            SoLuong: parseInt(req.body.soluong),
            HinhAnh: listhinhsp,
            QuaKhuyenMai: listquakm,
            PhuKien: listphukien,
            Mota: req.files.mota[0].filename,
            BaoHanh: parseInt(req.body.baohanh),
            TenThuongHieu: req.body.thuonghieu.trim(),
            DanhMuc: 'PC',
            NoiBat: req.body.noibat === 'true' ? true : false
        }

        if (listkhuyenmai.includes('') === true) {
            product.KhuyenMai = [];
        } else {
            product.KhuyenMai = listkhuyenmai;
        }

        let new_Ch = {
            CPU: req.body.pc_cpu,
            RAM: req.body.pc_ram,
            OCung: req.body.pc_ocung,
            CardManHinh: req.body.pc_cardmanhinh,
            GiaoTiepMang: req.body.pc_giaotiepmang,
            HeDieuHanh: req.body.pc_hedieuhanh,
            ODiaQuang: req.body.pc_odiaquang
        }

        let new_product = await PC.create(product);

        if (typeof new_product !== 'undefined') {
            new_Ch._id = new mongoose.Types.ObjectId(new_product._id);
            if (typeof await PC_CH.create(new_Ch) !== 'undefined') {
                return res.send(true);
            }
        }
        res.send(false);
})

route.put('/update/:id',
upload.fields([
    { name: 'hinhsp', maxCount: 10 },
    { name: 'mota', maXCount: 10 },
    { name: 'hinhkhuyenmai', maxCount: 10 }
]),
async(req,res)=>{
    let listhinhsp = [];
    let listquakm = [];
    let listkhuyenmai = req.body.khuyenmai.split(',');
    let tenquakm = req.body.tenquakm.split(',');
    let listphukien = req.body.phukien.split(',');

    let product = {
        TenSP: req.body.tensp.trim(),
        Gia: parseInt(req.body.gia),
        GiaGiam: parseInt(req.body.giagiam),
        SoLuong: parseInt(req.body.soluong),
        BaoHanh: parseInt(req.body.baohanh),
        TenThuongHieu: req.body.thuonghieu.trim(),
        DanhMuc: 'PC',
        NoiBat: req.body.noibat === 'true' ? true : false
    }

    if(tenquakm.includes('')===false){
        for (let i = 0; i < tenquakm.length; i++) {
            let itemKhuyenmai = {
                TenQuaKM: tenquakm[i],
                HinhKhuyenMai: req.files.hinhkhuyenmai[i].filename
            }
            listquakm.push(itemKhuyenmai);
        }
        product.QuaKhuyenMai=listquakm;
    }

    if(listkhuyenmai.includes('')===true){
        product.KhuyenMai=[];
    }else {
        product.KhuyenMai=listkhuyenmai;
    }

    if(listphukien.includes('')===true){
        product.PhuKien=[];
    }else {
        product.PhuKien=listphukien;
    }

    if (typeof req.files.hinhsp !== 'undefined') {
        req.files.hinhsp.forEach(item => listhinhsp.push(item.filename));
        product.HinhAnh = listhinhsp;
    }

    if (typeof req.files.mota !== 'undefined') {
        product.Mota = req.files.mota[0].filename;
    }

    let new_Ch = {
        CPU: req.body.pc_cpu,
        RAM: req.body.pc_ram,
        OCung: req.body.pc_ocung,
        CardManHinh: req.body.pc_cardmanhinh,
        GiaoTiepMang: req.body.pc_giaotiepmang,
        HeDieuHanh: req.body.pc_hedieuhanh,
        ODiaQuang: req.body.pc_odiaquang
    }

    let old_product = await PC.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });
    let listHinhAnh = [];

    if (typeof req.files.hinhsp !== 'undefined') {
        old_product.HinhAnh.forEach(itemHinhAnh => {
            listHinhAnh.push(itemHinhAnh);
        })
    }

    try {
        old_product.QuaKhuyenMai.forEach(itemKhuyenMai => {
            listHinhAnh.push(itemKhuyenMai.HinhKhuyenMai);
        })
    } catch (err) { console.log(err) }

    if (typeof req.files.mota !== 'undefined') {
        listHinhAnh.push(old_product.Mota);
    }

    if (listHinhAnh.length > 0) {
        listHinhAnh.forEach(itemHinhAnh => {
            try { fs.unlinkSync('./public/images/pc_img/' + itemHinhAnh); }
            catch (err) { console.log(err) }
        })
    }

    if (typeof await PC.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: product }) !== 'undefined') {
        if (typeof await PC_CH.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: new_Ch }) !== 'undefined') {
            return res.send(true);
        }
    }
    res.send(false);
})

route.delete('/delete/:id', async (req, res) => {
    let listNameFileHinhAnh = [];
    let fileHinhAnh = await PC.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });

    fileHinhAnh.HinhAnh.forEach(itemHinhAnh => {
        listNameFileHinhAnh.push(itemHinhAnh);
    })

    try {
        fileHinhAnh.QuaKhuyenMai.forEach(item => {
            listNameFileHinhAnh.push(item.HinhKhuyenMai)
        })
    } catch (err) { console.log('khong co qua km') }

    listNameFileHinhAnh.push(fileHinhAnh.Mota);

    listNameFileHinhAnh.forEach(itemHinhAnh => {
        try { fs.unlinkSync('./public/images/pc_img/' + itemHinhAnh); }
        catch (err) { console.log(err) }
    })

    if (typeof await PC.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }) !== 'undefined') {
        if (typeof await PC_CH.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }) !== 'undefined') {
            return res.send(true);
        }
    }
    res.send(false);
})

route.delete('/deleteAll', async (req, res) => {
    let listFieldHinhAnh = await PC.find({ DanhMuc: 'PC' }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });
    let listFileHinhAnh = [];
    listFieldHinhAnh.forEach(itemProduct => {
        itemProduct.HinhAnh.forEach(itemHinhAnh => {
            listFileHinhAnh.push(itemHinhAnh);
        })

        try {
            itemProduct.QuaKhuyenMai.forEach(itemQKM => {
                listFileHinhAnh.push(itemQKM.HinhKhuyenMai);
            })
        } catch (err) { console.log('khong co qua km') }

        listFileHinhAnh.push(itemProduct.Mota);
    })

    listFileHinhAnh.forEach(item => {
        try { fs.unlinkSync('./public/images/pc_img/' + item); }
        catch (err) { console.log(err) }
    })

    if (typeof await PC.deleteMany() !== 'undefined') {
        if (typeof await PC_CH.deleteMany() !== 'undefined') {
            return res.send(true)
        }
    }
    res.send(false);
})

module.exports = route;