"use strict";

var express = require("express"),
    async = require("async"),
    deploy = express.Router(),
    path = require("../utils/path"),
    db = require("../models"),
    App = db.App;

module.exports = deploy;

deploy.param("app", function(req, res, next, name) {
    App.findOne({
        name: name
    }, function(err, app) {
        req.app = app;
        next();
    });
});

deploy.route("/")
    .get(function(req, res) {
        App.find(function(err, app) {
            res.json(app);
        });
    });

deploy.route("/:app")
    .post(function(req, res) {
        if (!req.app) {
            return res.json(404, {
                error: "App doesn't exist"
            });
        }

        var execute = path(req.app.path);
        var tasks = req.app.tasks;

        async.mapSeries(tasks, execute, function(err, results){
            if(err) {
                return res.json(400, {
                    error: err.message
                });
            }

            res.json({
                result: results.join("\n\n")
            });
        });
    });