/*jslint node: true */
'use strict';

var express = require('express'),
    webapps = express.Router();

module.exports = webapps;

webapps.get('/',function(req, res){
    res.send('hello');
});