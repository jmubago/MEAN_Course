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
    var albumId = req.param.album;
    
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


module.exports = {
    getSong,
    saveSong,
    getSongs
}