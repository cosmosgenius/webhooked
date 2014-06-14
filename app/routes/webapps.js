/*jslint node: true */
'use strict';

var express = require('express'),
    webapps = express.Router();

var db = require('../models'),
    App = db.App;

module.exports = webapps;

webapps.route('/')
    .get(function(req, res) {
        res.send('hello');
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
        var JSONobj,newApp;
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
            return res.json(201, app);
        });
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