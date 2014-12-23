"use strict";
var mongoose = require("mongoose");

var logModel = require("./log.model"),
    appSchema;

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
    created_at: {
        type: Date,
        default: Date.now
    },
    modified_at: {
        type: Date,
        default: Date.now
    }
},{
    _id: false,
    id: false,
});

appSchema.pre("save", function(next){
  var now = new Date();
  this.updated_at = now;
  next();
});

appSchema.methods.getTasks = function() {
    return this.tasks;
};

appSchema.methods.addTasks = function (tasks, cb) {
    var _this = this;
    if (Array.isArray(tasks)) {
        tasks.forEach(function(task) {
            _this.tasks.push(task);
        });
    } else {
        this.tasks.push(tasks);
    }
    this.save(cb);
};

appSchema.methods.getLogs = function(from, to, cb) {
    if(typeof to === "function") {
        cb = to;
    }

    if(typeof from === "function") {
        cb = from;
    }

    return logModel.find(cb);
};

module.exports = mongoose.model("App", appSchema);