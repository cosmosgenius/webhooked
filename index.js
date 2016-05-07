'use strict';
require('dotenv').config();
require('./logging');

const http = require('http');
const app = require('./server');

let port = process.env.PORT || 6000;

const server = http.createServer(app.callback());

server.listen(port, () => {
    const address = server.address();
    console.log(`Listen to ${address.address} on port ${address.port} in ${app.env} env`);
});
