'use strict'

var mongoose = require('mongoose');
var Album = require('./album')

var schema = mongoose.Schema;

var artistSchema = schema({
    name: String,
    description: String,
    image: String
});

// delete all related albums
artistSchema.pre('remove', (next) => {
    Album.remove({artist: this._id}).exec();
    next();
})

module.exports = mongoose.model('Artist', artistSchema);