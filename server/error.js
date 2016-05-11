'use strict';
const co = require('co');

function* errorHandler(ctx, next) {
    try {
        yield next();
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message
        };
    }

}

module.exports = function() {
    return co.wrap(errorHandler);
};
