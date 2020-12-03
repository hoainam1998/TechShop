const express = require('express');
const route = express.Router();
const Dienthoai = require('../model_DB/Product_model');
const Dienthoai_CH = require('../model_DB/Dienthoai_CH_model');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: './public/images/smartphone_img',
    filename: function (req, file, cb) {
        cb(null, req.body.tensp + Math.floor(Math.random() * 1000000) + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

function checkFileType(file, cb) {
    const filetypes = /jpg|png|jpeg|html/;
    const extname = filetypes.test(path.extname(file.originalname));

    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb('Error: Images only');
    }
}

route.post('/create', upload.fields([
    { name: 'hinhsp', maxCount: 10 },
    { name: 'hinhkhuyenmai', maxCount: 10 },
    { name: 'mota', maxCount: 10 }
]), async (req, res) => {
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
    } catch (err) {
        console.log('khong co qua km')
    }

    req.files.hinhsp.forEach(item => listhinhsp.push(item.filename));

    let product = {
        TenSP: req.body.tensp.trim(),
        Gia: parseInt(req.body.gia),
        GiaGiam: parseInt(req.body.giagiam),
        SoLuong: parseInt(req.body.soluong),
        HinhAnh: listhinhsp,
        KhuyenMai: listkhuyenmai,
        QuaKhuyenMai: listquakm,
        PhuKien: listphukien,
        Mota: req.files.mota[0].filename,
        BaoHanh: parseInt(req.body.baohanh),
        TenThuongHieu: req.body.thuonghieu.trim(),
        DanhMuc: 'SmartPhone',
        NoiBat: req.body.noibat === 'true' ? true : false,
    }

    let new_CHCT = {
        ManHinh: req.body.manhinh.trim(),
        HDH: req.body.hdh,
        CameraSau: req.body.camerasau.trim(),
        CameraTruoc: req.body.cameratruoc.trim(),
        CPU: req.body.cpu.trim(),
        RAM: req.body.ram.trim(),
        BoNhoTrong: req.body.bonhotrong.trim(),
        TheNho: req.body.thenho.trim(),
        TheSim: req.body.thesim.trim(),
        DungLuongPin: req.body.dungluongpin.trim()+' mHA',
        ChatLieu: req.body.chatlieu.trim()
    }

    let new_product = await Dienthoai.create(product);

    if (typeof new_product !== 'undefined') {
        new_CHCT._id = new mongoose.Types.ObjectId(new_product._id);
        if (typeof await Dienthoai_CH.create(new_CHCT) !== 'undefined') {
            return res.send(true);
        }
    }
    res.send(false);
})

route.get('/all', async (req, res) => {
    let listProduct = await Dienthoai.find({ DanhMuc: 'SmartPhone' });
    res.json(listProduct);
})

route.delete('/deleteAll', async (req, res) => {
    let listFieldHinhAnh = await Dienthoai.find({ DanhMuc: 'SmartPhone' }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });
    let listFileHinhAnh = [];
    listFieldHinhAnh.forEach(itemProduct => {
        itemProduct.HinhAnh.forEach(itemHinhAnh => {
            listFileHinhAnh.push(itemHinhAnh);
        })
        itemProduct.QuaKhuyenMai.forEach(itemQKM => {
            listFileHinhAnh.push(itemQKM.HinhKhuyenMai);
        })

        listFileHinhAnh.push(itemProduct.Mota);
    })

    listFileHinhAnh.forEach(item => {
        try { fs.unlinkSync('./public/images/smartphone_img/' + item); }
        catch (err) { console.log(err) }
    })

    if (typeof await Dienthoai.deleteMany() !== 'undefined') {
        if (typeof await Dienthoai_CH.deleteMany() !== 'undefined') {
            return res.send(true)
        }
    }
    res.send(false);
})

route.delete('/delete/:id', async (req, res) => {
    let listNameFileHinhAnh = [];
    let fileHinhAnh = await Dienthoai.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });

    fileHinhAnh.HinhAnh.forEach(itemHinhAnh => {
        listNameFileHinhAnh.push(itemHinhAnh);
    })

    try {
        fileHinhAnh.QuaKhuyenMai.forEach(item => {
            listNameFileHinhAnh.push(item.HinhKhuyenMai)
        })
    } catch (err) { console.log('khong qua khuyen mai') }

    listNameFileHinhAnh.push(fileHinhAnh.Mota);

    listNameFileHinhAnh.forEach(itemHinhAnh => {
        try { fs.unlinkSync('./public/images/smartphone_img/' + itemHinhAnh); }
        catch (err) { console.log(err) }
    })

    if (typeof await Dienthoai.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }) !== 'undefined') {
        if (typeof await Dienthoai_CH.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }) !== 'undefined') {
            return res.send(true);
        }
    }
    res.send(false);
})

route.put('/update/:id', upload.fields([
    { name: 'hinhsp', maxCount: 10 },
    { name: 'mota', maXCount: 10 },
    { name: 'hinhkhuyenmai', maxCount: 10 }
]),
    async (req, res) => {
        let listTenquakm = req.body.tenquakm.split(',');
        let listKhuyenmai = req.body.khuyenmai.split(',');
        let listPhukien = req.body.phukien.split(',');
        let listHinhsp = [];
        let listQuaKhuyenMai = [];

        let product = {
            TenSP: req.body.tensp.trim(),
            Gia: parseInt(req.body.gia),
            GiaGiam: parseInt(req.body.giagiam),
            SoLuong: parseInt(req.body.soluong),
            PhuKien: listPhukien,
            BaoHanh: parseInt(req.body.baohanh),
            TenThuongHieu: req.body.thuonghieu.trim(),
            DanhMuc: 'SmartPhone',
            NoiBat: req.body.noibat === 'true' ? true : false
        }

        if(listTenquakm.includes('')===false){
            for (let i = 0; i < listTenquakm.length; i++) {
                let quakhuyenmai = {
                    TenQuaKM: listTenquakm[i],
                    HinhKhuyenMai: req.files.hinhkhuyenmai[i].filename
                }
                listQuaKhuyenMai.push(quakhuyenmai);
            }
            product.QuaKhuyenMai=listQuaKhuyenMai;
        }

        if(listKhuyenmai.includes('')===true){
            product.KhuyenMai=[];
        }else {
            product.KhuyenMai=listKhuyenmai;
        }

        if (typeof req.files.hinhsp !== 'undefined') {
            req.files.hinhsp.forEach(item => {
                listHinhsp.push(item.filename);
            })

            product.HinhAnh = listHinhsp;
        }

        if (typeof req.files.mota !== 'undefined') {
            product.Mota = req.files.mota[0].filename;
        }

        let old_product = await Dienthoai.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });

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
        } catch (err) { console.log('khong co hinh km') }


        if (typeof req.files.mota !== 'undefined') {
            listHinhAnh.push(old_product.Mota);
        }

        if (listHinhAnh.length > 0) {
            listHinhAnh.forEach(itemHinhAnh => {
                try { fs.unlinkSync('./public/images/smartphone_img/' + itemHinhAnh); }
                catch (err) { console.log(err) }
            })
        }

        let new_CHCT = {
            ManHinh: req.body.manhinh,
            HDH: req.body.hdh,
            CameraSau: req.body.camerasau.trim(),
            CameraTruoc: req.body.cameratruoc.trim(),
            CPU: req.body.cpu.trim(),
            RAM: req.body.ram.trim(),
            BoNhoTrong: req.body.bonhotrong.trim(),
            TheNho: req.body.thenho.trim(),
            TheSim:req.body.thesim.trim(),
            DungLuongPin: req.body.dungluongpin.trim()+' mHA',
            ChatLieu: req.body.chatlieu.trim()
        }

        if (typeof await Dienthoai.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: product }) !== 'undefined') {
            if (typeof await Dienthoai_CH.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: new_CHCT }) !== 'undefined') {
                return res.send(true)
            }
        }
        res.send(false);
    })

route.get('/get/:id', async (req, res) => {
    let product = await Dienthoai.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'dienthoai_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ]);
    res.json(product);
})

route.get('/search/:name', async (req, res) => {
    let listSp = await Dienthoai.aggregate([
        { $match: { $text: { $search: req.params.name.toLowerCase() } } },
        {
            $lookup: {
                from: 'dienthoai_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ]);
    res.json(listSp);
})

module.exports = route;