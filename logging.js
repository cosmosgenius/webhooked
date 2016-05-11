'use strict';
const co = require('co');
const uuid = require('uuid');
const chalk = require('chalk');
const bunyan = require('bunyan');

chalk.enabled = true;
let log = bunyan.createLogger({name: 'webhooked'});
let reqresLogger = bunyan.createLogger({
    name: 'webhooked',
    serializers: {
        req: function req(req) {
            if (!req || !req.connection) {
                return req;
            }
            let headers = Object.assign({}, req.headers);
            delete headers.authentication;
            return {
                method: req.method,
                url: req.url,
                headers: headers,
                remoteAddress: req.connection.remoteAddress,
                remotePort: req.connection.remotePort
            };
        },
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err
    }
});

const methods = [
    'log',
    'info',
    'warn',
    'error',
    'debug',
    'trace'
];

log.log = log.info;

methods.forEach((method)=>{
    console[method] = log[method].bind(log);
});

let devLogger = co.wrap(function* (ctx, next){
    const start = process.hrtime();
    ctx.log = reqresLogger.child({req_id: uuid.v4()});
    yield next();
    const status = ctx.res.statusCode;

    const method = status >= 500 ? chalk.red
        : status >= 400 ? chalk.yellow
        : status >= 300 ? chalk.cyan
        : status >= 200 ? chalk.green
        : (str) => str;

    const diff = process.hrtime(start);
    const res_time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

    let msg = [
        chalk.reset(ctx.req.method),
        ctx.req.url,
        method(status),
        `${res_time}ms -`,
        ctx.res._headers['content-length']
    ].join(' ');

    console.log(msg);
});

let prodLogger = co.wrap(function* (ctx, next) {
    const start = process.hrtime();
    ctx.log = reqresLogger.child({req_id: uuid.v4()});
    yield next();
    const status = ctx.res.statusCode;

    const method = status >= 500 ? 'error'
        : status >= 400 ? 'warn'
        : 'info';

    const diff = process.hrtime(start);
    const res_time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

    ctx.log[method]({req: ctx.req, res: ctx.res, duration: res_time});
});

console.reqLogger = (env) => {
    if(env === 'production') {
        return prodLogger;
    }
    return devLogger;
};

