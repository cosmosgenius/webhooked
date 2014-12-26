"use strict";

var debug = require("debug")("webhooked:model:app"),
    mongoose = require("mongoose");

var logSchema = new mongoose.Schema({
    app : { type: String, require: true},
    outputs : { type: Array, default: []},
    created_at: { type: Date, default: Date.now }
});

/**
 * Indexing the collection on "app" in accending order 
 * and "created_at" in decending order
 */
logSchema.index({ app: 1, created_at: -1 });

logSchema.methods.addOutput = function (task, output) {
    debug("adding task %s to log for app", task, this.app);
    return this.outputs.push({
        task: task,
        output: output
    });
};

module.exports = mongoose.model("Log",logSchema);