'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShareSchema = Schema({
	publication: { type: Schema.ObjectId, ref:'Publication' }
});

module.exports = mongoose.model('Share', ShareSchema);