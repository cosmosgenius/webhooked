"use strict";

var config = require("config"),
    db = require("monk")(config.mongouri);

module.exports.db = db;