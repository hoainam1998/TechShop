const mongoose = require('mongoose');
var dbConfig = 'mongodb+srv://HOAINAM:hoaimongktk20@cluster0.onj8r.mongodb.net/ShopTechDB?retryWrites=true&w=majority';
mongoose.connect(dbConfig, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('connected'))
    .catch(err => console.log(err));