'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Coments = require('../models/coments');
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

//guardar comentario
function saveComents(req, res){
	var params = req.body;
	//return res.status(200).send({params.text});
	if(!params.text) return res.status(200).send({message: 'Debes enviar un texto!!'});

	var coment = new Coments();
	coment.text = params.text;
	coment.publication = params.publication;
	coment.user = req.user.sub;
	coment.name = req.user.name;
	coment.surname = req.user.surname;
	coment.image = req.user.image;
	coment.created_at = moment().unix();
	
		coment.save((err, comentStored) => {
		if(err) return res.status(500).send({message: 'Error al dar Like'});

		if(!comentStored) return res.status(404).send({message: 'El like no se ha guardado'});
		
		return res.status(200).send({coment:comentStored});
	});
}
//obtener los comentarios de las publicaciones
function getComents(req, res){

	Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
		if(err) return res.status(500).send({message: 'Error devolver los usuarios seguidos'});

		var follows_clean = [];

		follows.forEach((follow) => {
			follows_clean.push(follow.followed);
		});
		follows_clean.push(req.user.sub);

	
	
		Publication.find({user: {"$in": follows_clean}}, (err, publications) => {
			if(err) return res.status(500).send({message: 'Error devolver publicaciones'});


			var publication_clean = [];

			publications.forEach((publication) => {
			publication_clean.push(publication._id);

			});
				
			
			Coments.find({publication: {"$in": publication_clean}}).sort('-created_at').exec((err, coments) => {
				if(err) return res.status(500).send({message: 'Error devolver comentarios'});
				if(!coments) return res.status(404).send({message: 'No hay comentarios'});

				return res.status(200).send({
					
					coments: coments
				});
			});
		});
	});
				
}


/*function deleteComent(req, res){
	var comentId = req.params.id;

	Coments.find({'user': req.user.sub, '_id': comentId}).remove(err => {
		if(err) return res.status(500).send({message: 'Error al borrar comentario'});
		
		return res.status(200).send({message: 'Comentario eliminado correctamente'});
	});
}
*/



module.exports = {
	saveComents,
	getComents
	//deleteComent
	//getPublicationsUser,
	//getPublication,
	//deletePublication,
	//uploadImage,
	//getImageFile
}