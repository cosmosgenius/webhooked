const bunyan = require('bunyan');
let log = bunyan.createLogger({name: 'webhooked'});

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
