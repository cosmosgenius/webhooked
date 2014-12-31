"use strict";

var express = require("express"),
    bodyParser = require("body-parser"),
    webapps = express.Router();

var db = require("../models"),
    App = db.App;

module.exports = webapps;

function createApp(req, res, next) {
    var app = new App(req.body);
    app.save(function(err, napp) {
        if (!err) {
            res.location(napp.name);
            return res.status(201).json(napp);
        }

        if(err.code === 11000) {
            next({
                status: 400,
                message: {
                    name: app.name,
                    text: "The app already exist"   
                }
            });
        } else {
            next({
                status: 400,
                message: err.errors
            });
        }
    });
}

function operationNotPossible(req, res, next) {
    next({
        status: 405,
        message: "operation not possible"
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
    .put(operationNotPossible)
    .delete(operationNotPossible)
    .all(function(err, req, res, next){
        res.status(err.status)
            .json({
                status: err.status,
                message: err.message
            });
        next();
    });

webapps.param("app", function(req, res, next, name) {
    App.findOne({
        name: name
    }, {
        _id:0, 
        __v:0
    }, function(err, app) {
        req.app = app;
        next(err);
    });
});

webapps.route("/:app")
    .all(function(req, res, next) {
        var err;
        if (!req.app) {
            err = {
                status: 404,
                message: "App doesn't exist"
            };
        }
        next(err);
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
    .post(operationNotPossible)
    .all(function(err, req, res, next){
        res.status(err.status)
            .json({
                status: err.status,
                message: err.message
            });
        next();
    });