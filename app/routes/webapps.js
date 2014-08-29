"use strict";

var express = require("express"),
    bodyparser = require("simple-bodyparser"),
    jsonparser = require("jsonparser"),
    webapps = express.Router();

var db = require("../models"),
    App = db.App;

module.exports = webapps;

webapps.route("/")
    .get(function(req, res) {
        App.find(function(err, app) {
            res.json(app);
        });
    })
    .post(bodyparser())
    .post(jsonparser({
        strict: true,
        bodyCheck : true
    }))
    .post(function(req, res) {
        var newApp = new App(req.json);
        newApp.save(function(err, app) {
            if (err) {
                return res.status(400).json({
                    message: "Invalid POST request."
                });
            }
            res.location(app.name);
            return res.status(201).json(app);
        });
    })
    .put(function(req, res){
        return res.status(405).end();
    })
    .delete(function(req, res){
        return res.status(405).end();
    })
    .all(function(err, req, res, next){
        if(err){
            res.status(err.status).json({
                message:err.message
            });
        }
        next();
    });

webapps.param("app", function(req, res, next, name) {
    App.findOne({
        name: name
    }, function(err, app) {
        req.app = app;
        next();
    });
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