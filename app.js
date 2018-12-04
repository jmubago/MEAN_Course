'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

// load routes
var userRoutes = require('./routes/user');
var artistRoutes = require('./routes/artist');
var albumRoutes = require('./routes/album');

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

// http headings


// base routes
app.use('/api', userRoutes);
app.use('/api', artistRoutes);
app.use('/api', albumRoutes);

module.exports = app;