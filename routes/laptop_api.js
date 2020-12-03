const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Laptop = require('../model_DB/Product_model');
const Laptop_CH = require('../model_DB/Laptop_CH_model');

const storage = multer.diskStorage({
    destination: './public/images/laptop_img',
    filename: function (req, file, cb) {
        cb(null, req.body.tensp + ' ' + Math.floor(Math.random() * 1000000) + path.extname(file.originalname));
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
    const filetype = /png|jpg|jpeg|html/;
    const extname = filetype.test(path.extname(file.originalname));
    const mimetype = filetype.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true)
    }
    cb('Images Only!');
}

route.get('/all', async (req, res) => {
    let all_laptop = await Laptop.find({ DanhMuc: 'Laptop' });
    res.send(all_laptop);
})

route.post('/create',
    upload.fields([
        { name: 'hinhsp', maxCount: 10 },
        { name: 'hinhkhuyenmai', maxCount: 10 },
        { name: 'mota', maxCount: 10 }
    ]),
    async (req, res) => {
        let listHinhAnhSP = [];
        let listQuaKhuyenMai = [];
        let listKhuyenMai = req.body.khuyenmai.split(',');
        let listPhuKien = req.body.phukien.split(',');
        let listTenQuaKhuyenMai = req.body.tenquakm.split(',');

        req.files.hinhsp.forEach(itemHinhanhSP => {
            listHinhAnhSP.push(itemHinhanhSP.filename);
        })

        console.log(req.body.khuyenmai);

        try {
            for (let i = 0; i < listTenQuaKhuyenMai.length; i++) {
                let quakm = {
                    TenQuaKM: listTenQuaKhuyenMai[i],
                    HinhKhuyenMai: req.files.hinhkhuyenmai[i].filename
                }
                listQuaKhuyenMai.push(quakm);
            }
        } catch (err) { console.log('khong co qua km') }

        let laptop = {
            TenSP: req.body.tensp,
            Gia: parseInt(req.body.gia),
            GiaGiam: parseInt(req.body.giagiam),
            SoLuong: parseInt(req.body.soluong),
            HinhAnh: listHinhAnhSP,
            KhuyenMai: listKhuyenMai,
            QuaKhuyenMai: listQuaKhuyenMai,
            PhuKien: listPhuKien,
            BaoHanh: parseInt(req.body.baohanh),
            Mota: req.files.mota[0].filename,
            TenThuongHieu: req.body.thuonghieu,
            DanhMuc: 'Laptop',
            NoiBat: req.body.noibat === 'true' ? true : false
        }

        let laptop_ch = {
            CPU: req.body.laptop_cpu,
            RAM: req.body.laptop_ram,
            OCung: req.body.laptop_ocung,
            ManHinh: req.body.laptop_manhinh,
            CardManHinh: req.body.laptop_cardmanhinh,
            CongKetNoi: req.body.laptop_congketnoi,
            HeDieuHanh: req.body.laptop_hedieuhanh,
            ThietKe: req.body.laptop_thietke
        }

        let new_laptop = await Laptop.create(laptop);

        if (typeof new_laptop !== 'undefined') {
            laptop_ch._id = new mongoose.Types.ObjectId(new_laptop._id);
            if (typeof await Laptop_CH.create(laptop_ch)) {
                return res.send(true);
            }
        }
        res.send(false);
    })

route.put('/update/:id', upload.fields([
    { name: 'hinhsp', maxCount: 10 },
    { name: 'hinhkhuyenmai', maxCount: 10 },
    { name: 'mota', maxCount: 10 }
]), async (req, res) => {

    let listKhuyenMai = req.body.khuyenmai.split(',');
    let listTenQuaKM = req.body.tenquakm.split(',');
    let listPhuKien = req.body.phukien.split(',');
    let listHinhAnhSP = [];
    let listQuaKM = [];

    let laptop = {
        TenSP: req.body.tensp.trim(),
        Gia: parseInt(req.body.gia),
        GiaGiam: parseInt(req.body.giagiam),
        SoLuong: parseInt(req.body.soluong),
        BaoHanh: parseInt(req.body.baohanh),
        TenThuongHieu: req.body.thuonghieu.trim(),
        DanhMuc: 'Laptop',
        NoiBat: req.body.noibat === 'true' ? true : false
    }

    if(listKhuyenMai.includes('')===true){
        laptop.KhuyenMai=[];
    }else {
        laptop.KhuyenMai=listKhuyenMai;
    }

    if(listTenQuaKM.includes('')===false){
        for (let i = 0; i < listTenQuaKM.length; i++) {
            let quakm = {
                TenQuaKM: listTenQuaKM[i],
                HinhKhuyenMai: req.files.hinhkhuyenmai[i].filename
            }
            listQuaKM.push(quakm);
        } 
        laptop.QuaKhuyenMai=listQuaKM;
    } 

    if (typeof req.files.hinhsp !== 'undefined') {
        req.files.hinhsp.forEach(hinhanh => {
            listHinhAnhSP.push(hinhanh.filename);
        })

        laptop.HinhAnh = listHinhAnhSP;
    }

    if (typeof req.files.mota !== 'undefined') {
        laptop.Mota = req.files.mota[0].filename;
    }

    if (listPhuKien.length > 0) {
        laptop.PhuKien = listPhuKien;
    }

    let laptop_ch = {
        CPU: req.body.laptop_cpu.trim(),
        RAM: req.body.laptop_ram.trim(),
        OCung: req.body.laptop_ocung.trim(),
        ManHinh: req.body.laptop_manhinh.trim(),
        CardManHinh: req.body.laptop_cardmanhinh.trim(),
        CongKetNoi: req.body.laptop_congketnoi.trim(),
        HeDieuHanh: req.body.laptop_hedieuhanh.trim(),
        ThietKe: req.body.laptop_thietke.trim(),
    }

    let old_product = await Laptop.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    let listHinhAnh_old_Product = [];

    if (typeof req.files.hinhsp !== 'undefined') {
        old_product.HinhAnh.forEach(hinhanh => {
            listHinhAnh_old_Product.push(hinhanh);
        })
    }

    try {
        old_product.QuaKhuyenMai.forEach(quakm => {
            listHinhAnh_old_Product.push(quakm.HinhKhuyenMai);
        })
    } catch (err) { console.log('khong co quan km') }

    if (typeof req.files.mota !== 'undefined') {
        listHinhAnh_old_Product.push(old_product.Mota);
    }

    listHinhAnh_old_Product.forEach(hinhanh => {
        try { fs.unlinkSync('./public/images/laptop_img/' + hinhanh); }
        catch (err) { console.log(err) }
    })

    if (typeof await Laptop.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: laptop }) !== 'undefined') {
        if (typeof await Laptop_CH.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: laptop_ch })) {
            return res.send(true);
        }
    }

    res.send(false);
})

route.delete('/deleteAll', async (req, res) => {
    let all_laptop = await Laptop.find({ DanhMuc: 'Laptop' });
    let listHinhAnh_To_Remove = [];
    all_laptop.forEach(laptop => {
        laptop.HinhAnh.forEach(hinhanh => {
            listHinhAnh_To_Remove.push(hinhanh);
        })

        try {
            laptop.QuaKhuyenMai.forEach(quakm => {
                listHinhAnh_To_Remove.push(quakm.HinhKhuyenMai);
            })
        } catch (err) { console.log('khong co qua km') }

        listHinhAnh_To_Remove.push(laptop.Mota);
    })

    listHinhAnh_To_Remove.forEach(hinhanh => {
        try {
            fs.unlinkSync('./public/images/laptop_img/' + hinhanh);
        } catch (err) { console.log(err) }
    })

    if (typeof await Laptop.deleteMany() !== 'undefined') {
        if (typeof await Laptop_CH.deleteMany() !== 'undefined') {
            return res.send(true);
        }
    }

    res.send(false);
})

route.delete('/delete/:id', async (req, res) => {
    let old_product = await Laptop.findOne({ _id: req.params.id });

    old_product.HinhAnh.forEach(hinhanh => {
        try { fs.unlinkSync('./public/images/laptop_img/' + hinhanh); }
        catch (err) { console.log(err); }
    })

    try {
        old_product.QuaKhuyenMai.forEach(quakm => {
            try { fs.unlinkSync('./public/images/laptop_img/' + quakm.HinhKhuyenMai); }
            catch (err) { console.log(err); }
        })
    } catch (err) { console.log('khong co qua km') }

    try { fs.unlinkSync('./public/images/laptop_img/' + old_product.Mota); }
    catch (err) { console.log(err); }

    if (await Laptop.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }) !== 'undefined') {
        if (await Laptop_CH.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }) !== 'undefined') {
            return res.send(true);
        }
    }

    res.send(false);
})

route.get('/get/:id', async (req, res) => {
    let laptop = await Laptop.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'laptop_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])
    res.json(laptop);
})

route.get('/search/:name', async (req, res) => {
    let laptop = await Laptop.aggregate([
        { $match: { $text: { $search: req.params.name.toLowerCase() } } },
        {
            $lookup: {
                from: 'laptop_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])

    res.json(laptop);
})

module.exports = route;