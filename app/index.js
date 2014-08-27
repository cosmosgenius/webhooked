'use strict';

var express         = require('express'),
    app             = express();

var webapps         = require('./routes/webapps'),
    deploy          = require('./routes/deploy');
    


app.use('/webapps',webapps);
app.use('/deploy',deploy);

module.exports = app;