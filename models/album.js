'use strict'

var mongoose = require('mongoose');
var Song = require('./song');

var schema = mongoose.Schema;

var albumSchema = schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: schema.ObjectId, ref: 'Artist' },
});

// delete all related songs
albumSchema.pre('remove', (next) => {
    Song.remove({album: this._id}).exec();
    next();
})


module.exports = mongoose.model('Album', albumSchema);