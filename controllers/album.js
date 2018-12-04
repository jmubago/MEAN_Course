'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) =>{
        if(err) {
            res.status(500).send({message: 'Server Error'});
        }else{
            if(!album){
                res.status(404).send({message: 'Album does not exist'});
            }else{
                res.status(200).send({album});
            }
        }
    })
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Server Error'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'Album has not been stored'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    })
}

module.exports = {
    getAlbum,
    saveAlbum
}