/*jslint node: true */
'use strict';

var express         = require('express'),
    logger          = require('morgan'),
    responseTime    = require('response-time');

var app             = express(),
    env             = process.env.NODE_ENV || 'development';

var webapps         = require('./routes/webapps'),
    deploy          = require('./routes/deploy'),
    mongoose        = require('./models');

if('production' === env) {
    app.use(logger());
}

if('development' === env) {
    mongoose.set('debug', true);
    app.use(logger('dev'));
    app.use(responseTime(5));
}

app.use('/webapps',webapps);
app.use('/deploy',deploy);

module.exports = app;