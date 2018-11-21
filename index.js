'user strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso_mean',  { useNewUrlParser: true }, (err, res) => {
    if (err){
        throw err;
    }else{
        app.listen(port, () => {
            console.log("API Rest server listening at http://localhost:" + port);
        })
    }
})