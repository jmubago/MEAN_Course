'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({message: 'Server error'});
        }else{
            if(!song){
                res.status(404).send({message: 'song does not exist'});
            }else{
                res.status(200).send({song});
            }
        }
    })
}

function getSongs(req, res) {
    var albumId = req.params.album;
    
    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if(err){
            res.status(500).send({message: 'Server error'});
        }else{
            if(!songs){
                res.status(404).send({message: 'There are no songs'});
            }else{
                res.status(200).send({songs});
            }
        }
    })
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if(err) {
            res.status(500).send({message: 'Server error'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'Song has not been saved'});
            }else{
                res.status(500).send({song: songStored});
            }
        }
    })
}

function updateSong(req, res) {
    var songId= req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update, (err, songUpdated) => {
        if(err){
            res.status(500).send({message: 'Server error'});
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'Song has not been updated'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    })
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndDelete(songId, (err, songRemoved) => {
        if(err){
            res.status(500).send({message: 'Server error'});
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'Song has not been deleted'});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    })
}

function uploadFile (req, res) {
    var songId = req.params.id;
    var file_name = 'Not uploaded';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; // recogemos solo el nombre del archivo

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; // recogemos solo la extensión del archivo

        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error when uploading the song'});
                }
                else if(!songUpdated){
                    res.status(404).send({message: 'Image could not be updated'});
                }else{
                    res.status(200).send({song: songUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Only valid file extensions are: .png, .jpg, .jpeg, and .gif'})
        }

    }else{
        res.status(200).send({message: 'You have not uploaded any song'});
    }
}

function getSongFile (req, res) {
    var imageFile = req.params.songFile;
    var path_file = './uploads/songs/' + imageFile;

    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Song does not exist'});
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}