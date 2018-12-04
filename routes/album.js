'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth = require('../middlewares/authenticated')
var multipart = require('connect-multiparty');

var api = express.Router();
var md_auth = require('../middlewares/authenticated'); // middleware with authetication
var md_upload = multipart({uploadDir: './uploads/albums'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);

module.exports = api;