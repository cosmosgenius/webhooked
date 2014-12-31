"use strict";

var express = require("express"),
    bodyParser = require("body-parser"),
    webapps = express.Router();

var db = require("../models"),
    App = db.App;

module.exports = webapps;

webapps.param("app", function(req, res, next, name) {
    App.findOne({
        name: name
    }, function(err, app) {
        req.app = app;
        next();
    });
});

function createApp(req, res, next) {
    var app = new App(req.body);
    app.save(function(err, app) {
        if (!err) {
            res.location(app.name);
            return res.status(201).json(app);
        }
        return next({
                status: 400,
                message: err.errors
            });
    });
}

webapps.route("/")
    .get(function(req, res) {
        App.find({},{_id:0, __v:0},function(err, apps) {
            res.json(apps);
        });
    })
    .post(bodyParser.json())
    .post(createApp)
    .put(function(req, res, next){
        next({
            status: 405,
            message: "operation not possible"
        });
    })
    .delete(function(req, res, next){
        next({
            status: 405,
            message: "operation not possible"
        });
    })
    .all(function(err, req, res, next){
        res.status(err.status)
            .json({
                status: err.status,
                message: err.message
            });
        next();
    });

webapps.route("/:app")
    .all(function(req, res, next) {
        if (!req.app) {
            return res.status(404).json({
                message: "App doesn't exist"
            });
        }
        next();
    })
    .get(function(req, res) {
        return res.json(req.app);
    })
    .put(bodyParser.json())
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