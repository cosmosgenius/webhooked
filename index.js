'use strict';
require('dotenv').config();
const app = require('./server');

let port = process.env.PORT || 6000;

app.listen(port);
