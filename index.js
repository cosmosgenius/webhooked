'use strict';
require('dotenv').config();
require('./logging');

const http = require('http');
const chalk = require('chalk');
const app = require('./server');

let port = process.env.PORT || 9000;

app.middleware.unshift(console.reqLogger());

const server = http.createServer(app.callback());

server.listen(port, () => {
    const address = server.address();
    console.log(chalk.reset(`Listen to ${chalk.yellow(address.address)} on port ${chalk.yellow(address.port)} in ${chalk.yellow(app.env)} env`));
});
