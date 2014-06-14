/*jslint node: true */
'use strict';

var express = require('express'),
    deploy  = express.Router();

module.exports = deploy;

deploy.param('app', function(req, res, next, name){
    req.appname = name;
    next();
});

deploy.route('/')
    .get(function(req, res) {
        res.send('hello');
    });

deploy.route('/:app')
    .get(function(req, res) {
        res.send(req.appname);
    })
    .post(function(req, res) {
        res.send(req.appname);
    });