const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const Product = require('../../model_DB/Product_model');

route.get('/:name', async (req, res) => {
    let listProductSearched = await Product.find({ $text: { $search: req.params.name } });
    res.json(listProductSearched);
})

module.exports=route;