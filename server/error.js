'use strict';
const co = require('co');

function* errorHandler(ctx, next) {
    try {
        yield next();
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        if(!(err.message instanceof Array)) {
            err.message = [{
                message: err.message
            }];
        }
        ctx.body = {
            errors: err.message
        };

        if(ctx.status >= 500) {
            ctx.log.error({err: err, res: ctx.res, req: ctx.req});
        }
    }

}

module.exports = function() {
    return co.wrap(errorHandler);
};
