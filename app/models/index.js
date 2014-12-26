"use strict";

var config  = require("config"),
    mongoose = require("mongoose");

mongoose.connect(config.mongouri);

module.exports = mongoose;
module.exports.App = require("./app.model");
module.exports.Log = require("./log.model");