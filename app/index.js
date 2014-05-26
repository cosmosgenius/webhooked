/*jslint node: true */
'use strict';

var express         = require('express'),
    logger          = require('morgan'),
    responseTime    = require('response-time');

var app             = express(),
    env             = process.env.NODE_ENV || 'development';

var webapps         = require('./routes/webapps');

if('production' === env) {
    app.use(logger());
}

if('development' === env) {
    app.use(logger('dev'));
    app.use(responseTime());
}

app.use('/webapps',webapps);

module.exports = app;