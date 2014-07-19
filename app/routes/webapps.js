/*jslint node: true */
'use strict';

var express = require('express'),
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
    .post(function(req, res, next) {
        var data = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            req.rawBody = data;
            next();
        });
    })
    .post(function(req, res) {
        var JSONobj, newApp;
        if (!req.is('json')) {
            return res.json(400, {
                error: 'Type should be json'
            });
        }

        if (!req.rawBody) {
            return res.json(400, {
                error: 'Request cannot be empty'
            });
        }

        try {
            JSONobj = JSON.parse(req.rawBody);
        } catch (e) {
            return res.json(400, {
                error: 'Invalid POST request.'
            });
        }
        newApp = new App(JSONobj);
        newApp.save(function(err, app) {
            if (err) {
                //console.log(err);
                return res.json(400, {
                    error: 'Invalid POST request.'
                });
            }
            res.location(app.name);
            return res.json(201, app);
        });
    })
    .put(function(req, res){
        return res.send(405);
    })
    .delete(function(req, res){
        return res.send(405);
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
            return res.json(404, {
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
            return res.send(204);
        });

    })
    .post(function(req, res){
        return res.send(405);
    });