/*jslint node: true */
'use strict';

var express = require('express'),
    webapps = express.Router(),
    AppModel = require('../models').App;

module.exports = webapps;

webapps.route('/')
    .get(function(req, res) {
        res.send('hello');
    })
    .post(function(req, res) {
        res.send('Post hello');
    });


webapps.route('/:app')
    .get(function(req, res) {
        res.send(req.params);
    })
    .post(function(req, res) {
        res.send(req.params);
    })
    .delete(function(req, res) {
        res.send(req.params);
    });