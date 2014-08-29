"use strict";

var mongoose = require("mongoose");

module.exports.createModel = function (name, spec) {
    var schema = new mongoose.Schema(spec);
    return mongoose.model(name, schema);
};

module.exports.connect = function (config) {
    mongoose.connect(config);
};

module.exports.debug = function (value) {
    if(!!value) {
        mongoose.set("debug", true);
    }
};