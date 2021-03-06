'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var md_auth = require('../middlewares/authenticated')
var multipart = require('connect-multiparty');

var api = express.Router();
var md_auth = require('../middlewares/authenticated'); // middleware with authetication
var md_upload = multipart({uploadDir: './uploads/artists'});

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtis);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getAllArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.put('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;