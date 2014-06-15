/*jslint node: true */
'use strict';

var express = require('express'),
    deploy  = express.Router(),
    db      = require('../models'),
    App     = db.App;

module.exports = deploy;

deploy.param('app', function(req, res, next, name){
    App.findOne({name : name}, function(err, app){
        req.app = app;
        next();
    });
});

deploy.route('/')
    .get(function(req, res) {
        App.find(function(err, app){
            res.json(app);
        });
    });

deploy.route('/:app')
    .get(function(req, res) {
        if(!req.app){
            return res.json(404, {error: 'App doesn\'t exist'});
        }
        res.json(req.app);
    });