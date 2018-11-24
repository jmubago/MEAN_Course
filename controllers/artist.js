'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message: 'Petition error' });
        } else {
            if (!artist) {
                res.status(404).send({ message: 'Artist does no exist' });
            } else {
                res.status(200).send({ artist })
            }
        }
    })

    // res.status(200).send({message:'metodo getArtis del controlador artist.js'});
}

function getAllArtists(req, res) {
    var page = req.params.page || 1;
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ message: 'Petition error' });
        } else {
            if (total === 0 || !artists) {
                res.status(404).send({ message: 'Artists does no exist' })
            } else {
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                })
            }
        }
    })
}


function saveArtis(req, res) {
    var artist = new Artist();

    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'Error when saving the artist' });
        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'Artis has not been saves' });
            } else {
                res.status(200).send({ artist: artistStored });
            }
        }
    })
}


function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    console.log(artistId);
    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error when updating the artis' });
        } else {
            if (!artistUpdated) {
                res.status(404).send({ message: 'Artis could not be found' });
            } else {
                res.status(200).send({ artist: artistUpdated });
            }
        }
    })
}


// function deleteArtist(req, res) {
//     var artistId = req.params.id;

//     Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
//         if (err) {
//             res.status(500).send({ message: 'Error when removing the artis' });
//         } else {
//             if (!artistRemoved) {
//                 res.status(404).send({ message: 'Artis has not been removed' });
//             } else {
//                 // res.status(200).send({artistRemoved});

//                 // Removing the album
//                 Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
//                     if (err) {
//                         res.status(500).send({ message: 'Error when removing the album' });
//                     } else {
//                         //console.log('albumRemoved: ', albumRemoved);
//                         if (!albumRemoved) {
//                             res.status(404).send({ message: 'Album has not been removed' });
//                         } else {
//                             //res.status(200).send({albumRemoved});

//                             // Removing the song
//                             Song.find({ artist: albumRemoved._id }).remove((err, songRemoved) => {
//                                 if (err) {
//                                     res.status(500).send({ message: 'Error when removing the song' });
//                                 } else {
//                                     //console.log('songRemoved: ', songRemoved);
//                                     if (!songRemoved) {
//                                         res.status(404).send({ message: 'Song has not been removed' });
//                                     } else {
//                                         res.status(200).send({ artist: artistRemoved });
//                                     }
//                                 }
//                             })
//                         }
//                     }
//                 })
//             }
//         }
//     })
// }

function deleteArtist(req, res) {
    var artistId = req.params.id;

    //Search the artist
    Artist.findById(artistId).exec() //returns promise
    .then( artistToRemove => {
        if(!artistToRemove) {
            throw new Error('Artist not found');
        }else{
            artistToRemove.remove();
        }
    })
    // returns response
    .then(artistRemoved => {
        return res.status(200).send({message: 'Artist has been removed'});
    })

    // handle errors
    .catch(err => {
        return res.status(404).send({message: 'Error when deleting the artis' + err});
    })
}

module.exports = {
    getArtist,
    saveArtis,
    getAllArtists,
    updateArtist,
    deleteArtist
}