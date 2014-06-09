/*jslint node: true */
'use strict';

var express = require('express'),
    webapps = express.Router(),
    AppModel = require('../models/app');

module.exports = webapps;

webapps.get('/',function(req, res){
    res.send('hello');
});

webapps.get('/:app',function(req, res){
    res.send(req.params);
});