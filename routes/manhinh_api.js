const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const ManHinh = require('../model_DB/Product_model');
const ManHinh_CH = require('../model_DB/ManHinh_CH_model');

const storage = multer.diskStorage({
    destination: './public/images/manhinh_img',
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
    const filetypes = /png|jpg|jpeg|html/;
    const extname = filetypes.test(path.extname(file.originalname));
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Errors : File not match');
    }
}

route.get('/all', async (req, res) => {
    let list_manhinh = await ManHinh.find({ DanhMuc: 'ManHinh' });
    res.json(list_manhinh);
})

route.get('/search/:name', async (req, res) => {
    let listSp = await ManHinh.aggregate([
        { $match: { $text: { $search: req.params.name.toLowerCase() } } },
        {
            $lookup: {
                from: 'manhinh_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ]);
    res.json(listSp);
})

route.get('/get/:id', async (req, res) => {
    let product = await ManHinh.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'manhinh_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ]);
    res.json(product);
})

route.delete('/delete/:id', async (req, res) => {
    let listNameFileHinhAnh = [];
    let fileHinhAnh = await ManHinh.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });

    fileHinhAnh.HinhAnh.forEach(itemHinhAnh => {
        listNameFileHinhAnh.push(itemHinhAnh);
    })

    try {
        fileHinhAnh.QuaKhuyenMai.forEach(item => {
            listNameFileHinhAnh.push(item.HinhKhuyenMai)
        })
    } catch (err) { console.log('khong qua km') }

    listNameFileHinhAnh.push(fileHinhAnh.Mota);

    listNameFileHinhAnh.forEach(itemHinhAnh => {
        try { fs.unlinkSync('./public/images/manhinh_img/' + itemHinhAnh); }
        catch (err) { console.log(err) }
    })

    if (typeof await ManHinh.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }) !== 'undefined') {
        if (typeof await ManHinh_CH.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }) !== 'undefined') {
            return res.send(true);
        }
    }
    res.send(false);
})

route.delete('/deleteAll', async (req, res) => {
    let listFieldHinhAnh = await ManHinh.find({ DanhMuc: 'ManHinh' }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });
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
        try { fs.unlinkSync('./public/images/manhinh_img/' + item); }
        catch (err) { console.log(err) }
    })

    if (typeof await ManHinh.deleteMany() !== 'undefined') {
        if (typeof await ManHinh_CH.deleteMany() !== 'undefined') {
            return res.send(true)
        }
    }
    res.send(false);
})

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
        DanhMuc: 'ManHinh',
        NoiBat: req.body.noibat === 'true' ? true : false
    }
    
    if (listkhuyenmai.includes('') === true) {
        product.KhuyenMai = [];
    } else {
        product.KhuyenMai = listkhuyenmai;
    }

    let manhinh_ch = {
        LoaiManHinh: req.body.loaimanhinh,
        CongNghe: req.body.congnghemanhinh.split(','),
        DoSang: req.body.dosang,
        ThoiGianDapUng: req.body.thoigiandapung,
        CongKetNoi: req.body.congketnoi.split(','),
        TanSoQuet: req.body.tansoquet,
        KichThuoc: { Ngang: req.body.ngang, Day: req.body.day, Cao: req.body.cao },
        TienIch: req.body.tienich.trim()
    }

    let new_product = await ManHinh.create(product);

    if (typeof new_product !== 'undefined') {
        manhinh_ch._id = new mongoose.Types.ObjectId(new_product._id);
        if (typeof await ManHinh_CH.create(manhinh_ch) !== 'undefined') {
            return res.send(true);
        }
    }

    res.send(false);
})

route.put('/update/:id', upload.fields([
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

        let product = {
            TenSP: req.body.tensp.trim(),
            Gia: parseInt(req.body.gia),
            GiaGiam: parseInt(req.body.giagiam),
            SoLuong: parseInt(req.body.soluong),
            PhuKien: listphukien,
            BaoHanh: parseInt(req.body.baohanh),
            TenThuongHieu: req.body.thuonghieu.trim(),
            DanhMuc: 'ManHinh',
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

        if (typeof req.files.hinhsp !== 'undefined') {
            req.files.hinhsp.forEach(item => listhinhsp.push(item.filename));
            product.HinhAnh = listhinhsp;
        }

        if (typeof req.files.mota !== 'undefined') {
            product.Mota = req.files.mota[0].filename;
        }

        let manhinh_ch = {
            LoaiManHinh: req.body.loaimanhinh,
            CongNghe: req.body.congnghemanhinh.split(','),
            DoSang: req.body.dosang,
            ThoiGianDapUng: req.body.thoigiandapung,
            CongKetNoi: req.body.congketnoi.split(','),
            TanSoQuet: req.body.tansoquet,
            KichThuoc: { Ngang: req.body.ngang, Day: req.body.day, Cao: req.body.cao },
            TienIch: req.body.tienich.trim()
        }

        let old_product = await ManHinh.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { HinhAnh: 1, QuaKhuyenMai: 1, Mota: 1, _id: 0 });

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
        } catch (err) { console.log('khong co qua km') }

        if (typeof req.files.mota !== 'undefined') {
            listHinhAnh.push(old_product.Mota);
        }

        if (listHinhAnh.length > 0) {
            listHinhAnh.forEach(itemHinhAnh => {
                try { fs.unlinkSync('./public/images/manhinh_img/' + itemHinhAnh); }
                catch (err) { console.log('xoa anh that bai') }
            })
        }

        if (typeof await ManHinh.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: product }) !== 'undefined') {
            if (typeof await ManHinh_CH.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: manhinh_ch }) !== 'undefined') {
                return res.send(true);
            }
        }
        res.send(false);
    })

module.exports = route;