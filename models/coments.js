'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentsSchema = Schema({
	publication: { type: Schema.ObjectId, ref:'Publications' },
	user: { type: Schema.ObjectId, ref:'User' },
	name: String,
	surname: String,
	image: String,
	text: String,
	created_at: String,
});

module.exports = mongoose.model('Coments', ComentsSchema);