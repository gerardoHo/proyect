'use strict'

var express = require('express');
var LikeController = require('../controllers/like');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');


api.post('/likes', md_auth.ensureAuth, LikeController.saveLike);
api.delete('/like/:id', md_auth.ensureAuth, LikeController.deleteLike);
api.get('/getLikes/:page?', md_auth.ensureAuth, LikeController.getLikeUsers);
api.get('/getcountlike/:id?', md_auth.ensureAuth, LikeController.getCounters);
api.get('/userLike', md_auth.ensureAuth, LikeController.userLike);  

 
module.exports = api;