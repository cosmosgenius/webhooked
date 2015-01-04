"use strict";

var express = require("express"),
    async = require("async"),
    debug = require("debug")("webhooked:routes:deploy"),
    bodyParser = require("body-parser"),
    deploy = express.Router();

var helper = require("./helper"),
    path = require("../utils/path"),
    db = require("../models"),
    App = db.App,
    Log = db.Log;

module.exports = deploy;

function doDeployment(req, res, next) {
    var execute = path(req.appInstance.path);
    var tasks = req.appInstance.tasks;

    async.mapSeries(tasks, execute, function(err, results){
        if(err) {
            return next({
                status: 400,
                message: err.message
            });
        }
        
        var log = new Log({
            app: req.appInstance.name
        });

        tasks.forEach(function(task, index) {
            log.addOutput(task, results[index]);
        });

        log.save(function(err, nlog) {
            if(!err) {
                debug("doDeployment request saved with %o", nlog);
                return res.status(201).json(nlog);
            }

            next({
                status: 400,
                message: err.errors
            });
        });
    });
}

deploy.param("app", function(req, res, next, name) {
    App.findOne({
        name: name
    }, function(err, app) {
        debug("found app %o", app);
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

deploy.route("/")
    .get(function(req, res) {
        App.find({}, {_id: 0, __v: 0}, function(err, apps) {
            res.json(apps);
        });
    })
    .delete(helper.operationNotPossible)
    .put(helper.operationNotPossible)
    .post(helper.operationNotPossible);

deploy.route("/:app")
    .get(function(req, res) {
        debug("Getting logs for %o app", req.appInstance.name);
        Log.find({
            app: req.appInstance.name
        }, {
            __v: 0
        }, function(err, logs) {
            debug("Found %o number of logs", logs.length);
            res.json(logs);
        });
    })
    .post(bodyParser.json())
    .post(doDeployment)
    .put(helper.operationNotPossible)
    .delete(helper.operationNotPossible);

deploy.use(helper.handleError);
