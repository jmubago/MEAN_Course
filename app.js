'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

// load routes
var userRoutes = require('./routes/user');

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

// http headings


// base routes
app.use('/api', userRoutes);

module.exports = app;