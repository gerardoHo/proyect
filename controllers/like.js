'use strict'

var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Like = require('../models/like');
var Publication = require('../models/publication');


function saveLike(req, res){
	var params = req.body;

	var like = new Like();
	like.user = req.user.sub;
	like.publication = params.publication;//publication se pasa por el post


	like.save((err, likeStored) => {
		if(err) return res.status(500).send({message: 'Error al dar Like'});

		if(!likeStored) return res.status(404).send({message: 'El like no se ha guardado'});
		
		return res.status(200).send({like:likeStored});
	});

}

function deleteLike(req, res){
	var userId = req.user.sub;
	var likeId = req.params.id;//publicacion que se va a dejar de seguir pasar por la url

	Like.find({'user':userId, 'publication':likeId}).remove(err => {
		if(err) return res.status(500).send({message: 'Error al quitar el like'});

		return res.status(200).send({message: 'El like se ha eliminado!!'});
	});
}


function getLikeUsers(req, res){
	var userId = req.user.sub;
		
	var page = 1;
	
	if(req.params.page){
		page = req.params.page;
	}else{
		page = req.params.id;
	}

	var itemsPerPage = 4;

	Like.find({user:userId}).paginate(page, itemsPerPage, (err, like, total) => {
		if(err) return res.status(500).send({message: 'Error en el servidor'});

		if(!like) return res.status(404).send({message: 'Aún no das ningun like'});


		return res.status(200).send({
				total: total,
				like,
				
			});
	
	});
}



function getCounters(req, res){
	var publicationId = req.params.id;
	
	if(req.params.id){
		publicationId = req.params.id;
	}

	getCountLike(publicationId).then((value) => {

			Publication.findByIdAndUpdate(publicationId, value, {new:true}, (err, LikeUpdated) => {
				if(err) return res.status(500).send({message: 'Error en la petición'});
				if(!LikeUpdated) return res.status(404).send({message: 'No se ha podido actualizar los likes'});
				return res.status(200).send({publication: LikeUpdated});
			});
	});
}

async function getCountLike(publication_id){
	var likes = await Like.count({"publication":publication_id}).exec((err, count) => {
		if(err) return handleError(err);
	});

	
	return {
		likes: likes
	 }
}


//revisa si el usuario le tiene like a cierta publicacion
function userLike(req, res){

	var userId = req.user.sub;
	//var publicationId = req.params.id;
	
	// res.status(200).send({update:update});
	 	    var query = Like.find({user: userId}).select('publication -_id ');

    query.exec(function (err, UserFind) {
        if(err) return res.status(500).send({message: 'Error en la petición'});
        if(!UserFind) return res.status(200).send({message: 'No tienes like a '+ publicationId});
        return res.status(200).send({encontrado: UserFind});
    });
		

}

module.exports = {
	saveLike,
	deleteLike, 
	getLikeUsers,
	getCounters,	
	userLike 

}