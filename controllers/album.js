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

function getAlbums(req, res) {
    var artistId = req.params.artist;

    if(!artistId) {
        // Get all albums from database
        var find = Album.find({}).sort('title');
    }else{
        // Get albums from specific artist in database
        var find = Album.find({artist: artistId}).sort('year');
    }
    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err) {
            res.status(500).send({message: 'Server Error'});
        }else{
            if(!albums){
                res.status(404).send({message: 'No albums'});
            }else{
                res.status(200).send({albums});
            }
        }
    });
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

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if(err) {
            res.status(500).send({message: 'Server Error'});
        }else {
            if(!albumUpdated){
                res.status(404).send({message: 'Album has not been updated'});
            }else{
                res.status(500).send({album: albumUpdated});
            }
        }
    })
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).exec()
    .then( albumToRemove => {
        if(!albumToRemove) {
            throw new Error ('Album not found');
        }else{
            albumToRemove.remove();
        }
    })
    .then(albumRemoved => {
        return res.status(200).send({message: 'Album has been removed'});
    })
    .catch (err => {
        return res.status(404).send({message: 'Error when deleting the album' + err});
    })
}

function uploadImage (req, res) {
    var albumId = req.params.id;
    var file_name = 'Not uploaded';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; // recogemos solo el nombre del archivo

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; // recogemos solo la extensión del archivo

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error when uploading the picture'});
                }
                else if(!albumUpdated){
                    res.status(404).send({message: 'Image could not be updated'});
                }else{
                    res.status(200).send({album: albumUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Only valid file extensions are: .png, .jpg, .jpeg, and .gif'})
        }

    }else{
        res.status(200).send({message: 'You have not uploaded any image'});
    }
}

function getImageFile (req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Image does not exist'});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}