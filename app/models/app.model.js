"use strict";
var debug = require("debug")("webhooked:model:app"),
    mongoose = require("mongoose");

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

var appSchema = new mongoose.Schema({
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

appSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
};

appSchema.pre("save", function(next) {
    var now = new Date();
    this.modified_at = now;
    debug("modified_at %o", this.modified_at);
    return next();
});

appSchema.methods.getTasks = function() {
    debug("getTasks: %o", this.tasks);
    return this.tasks;
};

appSchema.methods.addTask = function(task) {
    debug("adding %o Tasks ", task);
    return this.tasks.push(task);
};

module.exports = mongoose.model("App", appSchema);