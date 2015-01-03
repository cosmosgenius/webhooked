"use strict";

var debug = require("debug")("webhooked:routes:webapps"),
    express = require("express"),
    bodyParser = require("body-parser"),
    webapps = express.Router();

var db = require("../models"),
    App = db.App;

module.exports = webapps;

function createApp(req, res, next) {
    debug("createApp request with data %o", req.body);
    var app = new App(req.body);
    app.save(function(err, napp) {
        if (!err) {
            debug("createApp request saved with %o", napp);
            res.location(napp.name);
            return res.status(201).json(napp);
        }

        debug("createApp error %o", err);
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

function modifyApp(req, res, next) {
    debug("modifyApp request with data %o", req.body);
    if(req.body) {
        if (req.body.name && req.appInstance.name !== req.body.name) {
            return next({
                status: 400,
                message: "Cannot modify name"
            });
        }
        delete req.body.created_at;
        delete req.body.modified_at;

        for (var prop in req.body) {
            req.appInstance[prop] = req.body[prop];
        }
        req.appInstance.save(function(err, napp) {
            if (!err) {
                debug("modifyApp request saved with %o", napp);
                return res.json(req.appInstance);
            }

            debug("modifyApp error %o", err);
            next({
                status: 400,
                message: err.errors
            });
        });
    }
}

function deleteApp(req, res, next) {
    debug("deleteApp request for %o", req.appInstance);
    req.appInstance.remove(function(err) {
        if (err) {
            debug("deleteApp error %o", err);
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

function operationNotPossible(req, res, next) {
    next({
        status: 405,
        message: "operation not possible"
    });
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

webapps.route("/")
    .get(function(req, res) {
        App.find({}, {_id: 0, __v: 0}, function(err, apps) {
            res.json(apps);
        });
    })
    .post(bodyParser.json())
    .post(createApp)
    .put(operationNotPossible)
    .delete(operationNotPossible);

webapps.route("/:app")
    .get(function(req, res) {
        res.json(req.appInstance);
    })
    .put(bodyParser.json())
    .put(modifyApp)
    .delete(deleteApp)
    .post(operationNotPossible);

webapps.use(handleError);
