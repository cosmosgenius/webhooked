"use strict";

var debug = require("debug")("webhooked:routes:webapps"),
    async = require("async"),
    express = require("express"),
    bodyParser = require("body-parser"),
    webapps = express.Router();

var helper = require("./helper"),
    path = require("../utils/path"),
    db = require("../models"),
    App = db.App,
    Log = db.Log;

module.exports = webapps;

/**
 * returns a list of available apps
 */
function get_apps(req, res) {
    // __v:0 and _id:0 removes id and version which are internal to
    // mongoose
    return App.find({}, {_id: 0, __v: 0}, function(err, apps) {
        return res.json(apps);
    });
}

/**
 * Creates a new app
 */
function create_app(req, res, next) {
    debug("create_app request with data %o", req.body);
    //create a new app model instance with the req body
    var app = new App(req.body);

    app.save(function(err, napp) {
        if (!err) {
            debug("createApp request saved with %o", napp);
            res.location(napp.name);
            return res.status(201).json(napp);
        }

        debug("createApp error %o", err);
        // err code 11000 is return when there is a integrity error
        // in this case it happens due to creation of an app which has
        // a name already existing in db
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

/**
 * Modify the app
 * The properties which can be modified are:-
 *     - path
 *     - task
 */
function modify_app(req, res, next) {
    debug("modifyApp request with data %o", req.body);

    // app name cannot be modified
    if (req.body.name && req.appInstance.name !== req.body.name) {
        return next({
            status: 400,
            message: "Cannot modify name"
        });
    }

    // these needs to be deleted so that its not set again
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

/**
 * Delete app
 */
function delete_app(req, res, next) {
    debug("deleteApp request for %o", req.appInstance);

    Log.remove({
        app: req.appInstance.name
    }, function(log_err){
        if (log_err) {
            debug("deleteApp error on log remove %o", log_err);
            return next({
                status: 500,
                message: log_err
            });
        }

        req.appInstance.remove(function(err) {
            if (err) {
                debug("deleteApp error on app remove %o", err);
                return next({
                    status: 500,
                    message: err
                });
            }
            res.status(204).end();
        });
    });
}

/**
 * Do a new deployment
 */
function create_deployment(req, res, next) {
    // getting the execute function for the path of the app
    var execute = path(req.appInstance.path);
    // get the tasks
    var tasks = req.appInstance.tasks;

    // executing the tasks according to the order
    // present in the tasks array
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

function get_logs(req, res) {
    debug("Getting logs for %o app", req.appInstance.name);
    // remove version __v:0 (mongoose internal)
    Log.find({
        app: req.appInstance.name
    }, {
        __v: 0
    }, function(err, logs) {
        debug("Found %o number of logs", logs.length);
        res.json(logs);
    });
}

webapps.param("app", function(req, res, next, name) {
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

webapps.route("/")
    .get(get_apps)
    .post(bodyParser.json())
    .post(create_app)
    .patch(helper.operationNotPossible)
    .put(helper.operationNotPossible)
    .delete(helper.operationNotPossible);

webapps.route("/:app")
    .get(function(req, res) {
        res.json(req.appInstance);
    })
    .put(bodyParser.json())
    .put(modify_app)
    .patch(modify_app)
    .delete(delete_app)
    .post(helper.operationNotPossible);

webapps.route("/:app/deploy")
    .get(get_logs)
    .post(bodyParser.json())
    .post(create_deployment)
    .put(helper.operationNotPossible)
    .patch(helper.operationNotPossible)
    .delete(helper.operationNotPossible);

webapps.use(helper.handleError);
