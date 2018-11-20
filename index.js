'user strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean', (err, res) => {
    if (err){
        throw err;
    }else{
        console.log('La conexión a la BBDD está funcionando correctamente');
        app.listen(port, () => {
            console.log("Servidor del API Rest escuchando en http://localhost:" + port);
        })
    }
})