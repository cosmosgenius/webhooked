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

function deleteApp(req, res, next) {
    req.appInstance.remove(function(err) {
        if (err) {
            return next({
                status: 500,
                message: err
            });
        }
        res.status(204).end();
    });
}

function handleError(err, req, res, next) {
    res.status(err.status)
        .json({
            status: err.status,
            message: err.message
        });
    next();
}

webapps.param("app", function(req, res, next, name) {
    App.findOne({
        name: name
    }, function(err, app) {
        req.appInstance = app;
        if(!app) {
            err = {
                status: 404,
                message: "App doesn't exist"
            };
        }
        next(err);
    });
});

function operationNotPossible(req, res, next) {
    next({
        status: 405,
        message: "operation not possible"
    });
}

webapps.route("/")
    .get(function(req, res) {
        App.find({}, {_id: 0, __v: 0}, function(err, apps) {
            res.json(apps);
        });
    })
    .post(bodyParser.json())
    .post(createApp)
    .put(operationNotPossible)
    .delete(operationNotPossible)
    .all(handleError);

webapps.route("/:app")
    .all(function(req, res, next) {
        var err;
        if (!req.appInstance) {
            err = {
                status: 404,
                message: "App doesn't exist"
            };
        }
        next(err);
    })
    .get(function(req, res) {
        res.json(req.appInstance);
    })
    .put(bodyParser.json())
    .put(function(req, res) {
        if(req.body) {
            for (var prop in req.body) {
                req.appInstance[prop] = req.body[prop];
            }    
        }
        res.send(req.appInstance);
    })
    .delete(deleteApp)
    .post(operationNotPossible)
    .all(handleError);

webapps.route("/:app/tasks")
    .get(function(req, res, next) {
        res.json(req.appInstance.tasks);
    })
    .post()
    .delete()
    .put(operationNotPossible);


webapps.route("/:app/tasks/:taskid")
    .get(function(req, res) {
        res.send(req.appInstance.tasks[req.params.taskid]);
    })
    .put()
    .delete()
    .post(operationNotPossible);

webapps.use(handleError);