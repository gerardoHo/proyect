'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');
var Like = require('../models/like');
var Share = require('../models/share');

function saveShare(req, res){
	var params = req.body;

	var share = new Share();
	share.publication = params.publication;

	share.save((err, shareStored) => {
		if(err) return res.status(500).send({message: 'Error al guardar la compartida'});

		if(!shareStored) return res.status(404).send({message: 'La compartida NO ha sido guardada'});
			

		
			var publication = new Publication();
			publication.text = null;
			publication.share = shareStored._id;
			publication.file = 'null';
			publication.user = req.user.sub;
			publication.created_at = moment().unix();
			publication.likes = 0;

			publication.save((err, publicationStored) => {
				if(err) return res.status(500).send({message: 'Error al guardar la publicación compartida'});

				if(!publicationStored) return res.status(404).send({message: 'La publicación compartida NO ha sido guardada'});

				return res.status(200).send({publication: publicationStored});
			});
			});
}


function getShares(req, res){

	Share.find()
	.populate({
            path: 'publication',
            model: 'Publication',
            populate: {
                path: 'user',
                model: 'User'  }         
            
        }).exec((err, shares) => {
		if(err) return res.status(500).send(err);


				return res.status(200).send({
					
					shares: shares
				});
			});
	
				
}


function deleteShare(req, res){
	var publicationId = req.params.id;

	Publication.find({'user': req.user.sub, '_id': publicationId}).remove(err => {
		if(err) return res.status(500).send({message: 'Error al borrar publicaciones'});
		
		return res.status(200).send({message: 'Publicación eliminada correctamente'});
	});
}




module.exports = {
	saveShare,
	getShares

}