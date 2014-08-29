"use strict";

var config      = require("config");
var manager     = require("./mongoose.manager");

manager.connect(config.mongouri);
module.exports = manager;
module.exports.App = manager.createModel("App",require("./app.model"));