'use strict'

var express = require('express');
var ComentsController = require('../controllers/coments');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');


api.post('/saveComent', md_auth.ensureAuth, ComentsController.saveComents);
api.get('/getComents', md_auth.ensureAuth, ComentsController.getComents);

module.exports = api; 