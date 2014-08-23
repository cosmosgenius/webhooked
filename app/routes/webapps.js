/*jslint node: true */
'use strict';

var express = require('express'),
    bodyparser = require('simple-bodyparser'),
    webapps = express.Router();

var db = require('../models'),
    App = db.App;

module.exports = webapps;

webapps.route('/')
    .get(function(req, res) {
        App.find(function(err, app) {
            res.json(app);
        });
    })
    .post(bodyparser())
    .post(function(req, res) {
        var JSONobj, newApp;
        if (!req.is('json')) {
            return res.status(400).json({
                error: 'Type should be json'
            });
        }

        if (!req.body) {
            return res.status(400).json({
                error: 'Request cannot be empty'
            });
        }

        try {
            JSONobj = JSON.parse(req.body);
        } catch (e) {
            return res.status(400).json({
                error: 'Invalid POST request.'
            });
        }
        newApp = new App(JSONobj);
        newApp.save(function(err, app) {
            if (err) {
                //console.log(err);
                return res.status(400).json({
                    error: 'Invalid POST request.'
                });
            }
            res.location(app.name);
            return res.status(201).json(app);
        });
    })
    .put(function(req, res){
        return res.status(405).end();
    })
    .delete(function(req, res){
        return res.status(405).end();
    });

webapps.param('app', function(req, res, next, name) {
    App.findOne({
        name: name
    }, function(err, app) {
        req.app = app;
        next();
    });
});

webapps.route('/:app')
    .all(function(req, res, next) {
        if (!req.app) {
            return res.status(404).json({
                error: 'App doesn\'t exist'
            });
        }
        next();
    })
    .get(function(req, res) {
        return res.json(req.app);
    })
    .put(function(req, res) {
        res.send(req.app);
    })
    .delete(function(req, res) {
        req.app.remove(function(err) {
            if (err) {
                res.json(err);
            }
            return res.status(204).end();
        });

    })
    .post(function(req, res){
        return res.status(405).end();
    });