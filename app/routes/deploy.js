/*jslint node: true */
'use strict';

var express = require('express'),
    deploy = express.Router();

module.exports = deploy;

deploy.route('/')
    .get(function(req, res) {
        res.send('hello');
    });

deploy.route('/:app')
    .get(function(req, res) {
        res.send(req.params);
    })
    .post(function(req, res) {
        res.send(req.params);
    });