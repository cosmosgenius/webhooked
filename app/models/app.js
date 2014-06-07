/*jslint node: true */
'use strict';

var Sequelize   = require('sequelize'),
    sequelize   = require('./');

var App     = sequelize.define('App',{
    name: Sequelize.STRING,
    path: Sequelize.STRING,
});

module.exports = App;