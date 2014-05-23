/*jslint node: true */
var config      = {};


config.port     = 8000;
config.env      = process.env.NODE_ENV || 'development';

if (config.env  === 'test') {
    config.port     = 8500;
}

module.exports  = config;