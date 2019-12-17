'use strict'

var express = require('express');
var ShareController = require('../controllers/share');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/saveShare', md_auth.ensureAuth, ShareController.saveShare);
api.get('/getShares', md_auth.ensureAuth, ShareController.getShares);

module.exports = api; 