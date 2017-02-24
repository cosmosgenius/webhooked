const proc = require("child_process")
const debug = require("debug")("webhooked:utils");

/**
 * Map to handle messages
 * @constant
 * @type {Object}
 */
const messages = {
    pathError : "path should be of type string",
    commandError : "command should be of type string"
};

/**
 * Executes the given command at the given path
 * @param {String} command
 * @param {String} path
 * @see executeCommand
 */
function executeCommand(command, path){
    return new Promise(function(resolve, reject) {
        debug("command '%s' on path '%s'", command, path);

        if (typeof command !== "string") {
            reject(new TypeError(messages.commandError));
        }

        function resultcb(err, data){
            if(err) return reject(err);
            resolve(data);
        }

        proc.exec(command, {
            cwd: path
        }, resultcb);
    });
}

/**
 * A generator which returns a function which accepts command to be executed at the given path
 * @method generatePath
 * @param  {String} path
 * @return {Function}     a function which accepts a command as parameter and a callback function
 */
function generatePath(path) {
    debug("path '%s'", path);
    if (!path) {
        path = ".";
    }

    if (typeof path !== "string") {
        throw new TypeError(messages.pathError);
    }

    return function(command) {
        return executeCommand(command, path);
    };
}

module.exports.path = generatePath;
