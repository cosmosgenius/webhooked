'use strict';
const level = require('level');

let db = level('./db');

module.exports = db;
