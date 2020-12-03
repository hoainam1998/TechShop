const express=require('express');
const expressLayout=require('express-ejs-layouts');
const app=express();
const path=require('path');

app.use(expressLayout);
app.set('view engine','ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'/public')));

require('../ConnectionDB/connectionDB');
const PORT=process.env.PORT || 3000;

app.listen(PORT,console.log('Client started at '+PORT));

app.use('/',require('./routes/server'));
app.use('/api/home',require('./api/home_api'));
app.use('/api/search',require('./api/search_api'));
app.use('/api/cart',require('./api/cart_api'));

