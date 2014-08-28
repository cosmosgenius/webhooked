"use strict";

var exec = require("child_process").exec,
    Q = require("q");

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
 * @param  {String} command 
 * @param  {String} path    
 * @return {Promise}
 * @see executeCommand
 */
function executeCommand(command, path){
    return Q.Promise(function(resolve, reject) {
            exec(command, {
                cwd: path
            }, function(error, stdout) {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });

        });
}

/**
 * A generator which returns a function which accepts command to be executed at the given path
 * @method generatePath
 * @param  {String} path
 * @return {Function}     a function which accepts a command as parameter
 */
function generatePath(path) {
    if (!path) {
        path = ".";
    }

    if (typeof path !== "string") {
        throw new TypeError(messages.pathError);
    }

    return function(command) {
        if (typeof command !== "string") {
            throw new TypeError(messages.commandError);
        }
        return executeCommand(command, path);
    };
}

module.exports = generatePath;