'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

// load routes

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

// http headings


// base routes

app.get('/pruebas', (req, res) =>{
    res.status(200).send({message: 'api rest funcionando'})
});

module.exports = app;