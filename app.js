const express=require('express');
const expressLayout=require('express-ejs-layouts');
const app=express();
const path=require('path');
const bodyParser=require('body-parser');

app.use(bodyParser.json());

app.use(expressLayout);
app.set('view engine','ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'/public')));

app.use('/',require('./routes/index'));
app.use('/upload',require('./routes/uploadImages'));
app.use('/api',require('./routes/api'));

require('./ConnectionDB/connectionDB');

const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log('Sever stated at '+PORT));


