/*jslint node: true */
'use strict';

var express = require('express'),
    Q = require('q'),
    deploy = express.Router(),
    path = require('../utils/path'),
    db = require('../models'),
    App = db.App;

module.exports = deploy;

deploy.param('app', function(req, res, next, name) {
    App.findOne({
        name: name
    }, function(err, app) {
        req.app = app;
        next();
    });
});

deploy.route('/')
    .get(function(req, res) {
        App.find(function(err, app) {
            res.json(app);
        });
    });

deploy.route('/:app')
    .get(function(req, res) {
        if (!req.app) {
            return res.json(404, {
                error: 'App doesn\'t exist'
            });
        }

        var execute = path(req.app.path);
        var tasks = req.app.tasks;
        var taskPromise = [];

        tasks.forEach(function(task) {
            taskPromise.push(execute(task));
        });

        Q.all(taskPromise).then(function(results) {
            var response = '';
            
            results.forEach(function(result) {
                response += result;
            });

            res.json({result:response});

        }).fail(function(err) {

            res.json(400, {
                error: err.message
            });

        });
    });