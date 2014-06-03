/*jslint node: true */
'use strict';

var Sequelize   = require('sequelize'),
    config      = require('../../instance/config');

var sequelize = new Sequelize(config.db, config.dbuser, config.db, {
    dialect : config.dbtype,
    port    : config.dbport
});

module.exports = sequelize;