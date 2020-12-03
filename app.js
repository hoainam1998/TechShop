const express=require('express');
const expressLayout=require('express-ejs-layouts');
const app=express();
const path=require('path');
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(expressLayout);
app.set('view engine','ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'/public')));

app.use('/',require('./routes/index'));
app.use('/api/smartphone',require('./routes/smartphone_api'));
app.use('/api/laptop',require('./routes/laptop_api'));
app.use('/api/tablet',require('./routes/tablet_api'));
app.use('/api/tainghe',require('./routes/tainghe_api'));
app.use('/api/manhinh',require('./routes/manhinh_api'));
app.use('/api/pc',require('./routes/pc_api'));

require('./ConnectionDB/connectionDB');

const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log('Sever stated at '+PORT));


