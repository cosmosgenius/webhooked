/*jslint node: true */
'use strict';

var exec = require('child_process').exec,
    Q = require('q');

module.exports = function(path) {

    if (!path) {
        path = '.';
    }

    if (typeof path !== 'string') {
        throw new TypeError('path should be of type string');
    }

    return function(command) {

        if (typeof command !== 'string') {
            throw new TypeError('command should be of type string');
        }

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
    };
};