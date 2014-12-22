"use strict";
var mongoose = require("mongoose");

var schema, app;

function minlength(len) {
    return function(value) {
        if (value) {
            return value.length >= len;
        }
        return false;
    };
}

schema = new mongoose.Schema({
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
        validate: [minlength(1), "Name cannot be less than 1 characters"]
    },
    tasks: [String]
});

app = mongoose.model("App", schema);

module.exports = app;
/*
module.exports.createApp = function(specs) {

};

module.exports.deleteApp = function(name) {

};

module.exports.find = function(criteria, cb) {
    
};

module.exports.findById = function(name) {

};

module.exports.updateApp = function() {

};*/