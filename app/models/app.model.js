"use strict";

function minlength(len) {
    return function(value) {
        if (value) {
            return value.length >= len;
        }
        return false;
    };
}

module.exports = {
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
};