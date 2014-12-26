"use strict";
var debug = require("debug")("webhooked:model:app"),
    mongoose = require("mongoose");

var logModel = require("./log.model"),
    appSchema;

/**
 * generator which create a minlength check function
 * @param  {Number} len   Minimum length to check
 * @return {Function}     A function which returns false the length is 
 *                          less than minimum length.
 */
function minlength(len) {
    return function(value) {
        if (value) {
            return value.length >= len;
        }
        return false;
    };
}

appSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique : true,
        validate: [minlength(2), "Name cannot be less than 2 characters"]
    },
    path: {
        type: String,
        required: true,
        trim: true,
        validate: [minlength(1), "Path cannot be null"]
    },
    tasks: [String],
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
});

appSchema.pre("save", function(next){
    var now = new Date();
    this.updated_at = now;
    debug("updated_at ", this.updated_at);
    next();
});

appSchema.methods.getTasks = function() {
    debug("getTasks: %s", this.tasks);
    return this.tasks;
};

appSchema.methods.addTasks = function (tasks) {
    debug("adding %s Tasks ", tasks);
    var _this = this;
    if (Array.isArray(tasks)) {
        tasks.forEach(function(task) {
            _this.tasks.push(task);
        });
    } else {
        this.tasks.push(tasks);
    }
    debug("task list is %s", this.tasks);
};

appSchema.methods.getLogs = function(from, to, cb) {
    if(typeof from === "function" || typeof to === "function") {
        cb = to || from;
    }

    return logModel.find({ app: this.name },{ app: 0 }, 
        function(err, logs) {
            return cb(err,logs);
        });
};

appSchema.methods.addLog = function() {
      
};

module.exports = mongoose.model("App", appSchema);