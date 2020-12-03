const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const Product = require('../../model_DB/Product_model');

route.get('/smartphone', async (req, res) => {
    let list_smartphone = await Product.aggregate([
        { $match: { DanhMuc: 'SmartPhone' } },
        {
            $lookup: {
                from: 'dienthoai_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])
    res.json(list_smartphone);
})

route.get('/laptop', async (req, res) => {
    let list_laptop = await Product.aggregate([
        { $match: { DanhMuc: 'Laptop' } },
        {
            $lookup: {
                from: 'laptop_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])
    res.json(list_laptop);
})

route.get('/tablet', async (req, res) => {
    let list_tablet = await Product.aggregate([
        { $match: { DanhMuc: 'Tablet' } },
        {
            $lookup: {
                from: 'dienthoai_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])
    res.json(list_tablet);
})

route.get('/pc', async (req, res) => {
    let list_pc = await Product.aggregate([
        { $match: { DanhMuc: 'PC' } },
        {
            $lookup: {
                from: 'pc_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])

    res.json(list_pc);
})

route.get('/manhinh', async (req, res) => {
    let list_manhinh = await Product.aggregate([
        { $match: { DanhMuc: 'ManHinh' } },
        {
            $lookup: {
                from: 'manhinh_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])

    res.json(list_manhinh);
})

route.get('/tainghe', async (req, res) => {
    let list_tainghe = await Product.aggregate([
        { $match: { DanhMuc: 'TaiNghe' } },
        {
            $lookup: {
                from: 'tainghe_ches',
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])
    res.json(list_tainghe);
})

route.get('/discount_product', async (req, res) => {
    let listProduct_discount = await Product.find({ GiaGiam: { $gt: 0 } })
    res.json(listProduct_discount);
})

route.get('/:categories/:id', async (req, res) => {
    let categories = req.params.categories.toLowerCase();
    let categories_cauhinh='';
    if(categories==='smartphone'|| categories==='tablet'){
        categories_cauhinh='dienthoai_ches';
    }else {categories_cauhinh=categories.toLowerCase()+'_ches';}
    let product = await Product.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id), DanhMuc: req.params.categories } },
        {
            $lookup: {
                from: categories_cauhinh,
                localField: '_id',
                foreignField: '_id',
                as: 'cauhinh'
            }
        }
    ])

    res.json(product);
})

route.get('/distinct', async (req, res) => {
    let distinctDanhMuc = await Product.distinct('DanhMuc');
    let distinctTTH = await Product.distinct('TenThuongHieu');
    let distinctID = await Product.distinct('_id');

    res.json({ DanhMuc: distinctDanhMuc, TTH: distinctTTH, ID: distinctID });
})

route.get('/:categories/:brand/:id', async (req, res) => {
    let categories = req.params.categories;
    let categories_cauhinh='';
    if(categories.toLowerCase()==='smartphone'|| categories.toLowerCase()==='tablet'){
        categories_cauhinh='dienthoai_ches';
    }else {categories_cauhinh=categories.toLowerCase()+'_ches';}
    let brand = req.params.brand;
    let id = req.params.id;
    let products = await Product
        .aggregate([
            { $match: { DanhMuc: categories, TenThuongHieu: brand, _id: { $not: { $eq: mongoose.Types.ObjectId(id) } } } },
            {
                $lookup: {
                    from: categories_cauhinh,
                    localField: '_id',
                    foreignField: '_id',
                    as: 'cauhinh'
                }
            }
        ]);
    res.json(products);
})

module.exports = route;
