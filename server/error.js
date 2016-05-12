'use strict';
const co = require('co');

function* errorHandler(ctx, next) {
    try {
        yield next();
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;

        let messages = err.message;

        if(!(messages instanceof Array)) {
            messages = [{
                message: messages
            }];
        }
        ctx.body = {
            errors: messages
        };

        if(ctx.status >= 500) {
            ctx.log.error({err: err, res: ctx.res, req: ctx.req});
        }
    }

}

module.exports = function() {
    return co.wrap(errorHandler);
};
