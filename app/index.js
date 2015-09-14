'use strict';

let express         = require('express'),
    cors            = require('cors'),
    app             = express();

let webapps         = require('./routes/webapps');


app.use(cors());
app.use('/',webapps);

module.exports = app;
