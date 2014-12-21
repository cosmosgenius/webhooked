"use strict";

var exec = require("child_process").exec;

/**
 * Map to handle messages
 * @constant
 * @type {Object}
 */
var messages = {
    pathError : "path should be of type string",
    commandError : "command should be of type string"
};

/**
 * Executes the given command at the given path
 * @param {String} command 
 * @param {String} path
 * @param {Function} cb callback function
 * @see executeCommand
 */
function executeCommand(command, path, cb){

    if (typeof command !== "string") {
        return cb(new TypeError(messages.commandError));
    }

    exec(command, {
        cwd: path
    }, cb);
}

/**
 * A generator which returns a function which accepts command to be executed at the given path
 * @method generatePath
 * @param  {String} path
 * @return {Function}     a function which accepts a command as parameter and a callback function
 */
function generatePath(path) {
    if (!path) {
        path = ".";
    }

    if (typeof path !== "string") {
        throw new TypeError(messages.pathError);
    }

    return function(command, cb) {
        executeCommand(command, path, cb);
    };
}

module.exports = generatePath;