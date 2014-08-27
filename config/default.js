'use strict';
var config      = {};


config.port     = 8000;
config.env      = process.env.NODE_ENV || 'development';
config.mongouri = 'mongodb://localhost:27017/webhooked';

module.exports  = config;