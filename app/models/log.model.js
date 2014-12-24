"use strict";

var debug = require("debug")("model:log"),
    mongoose = require("mongoose");

var schema = new mongoose.Schema({
    output : { type:String, require: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log",schema);