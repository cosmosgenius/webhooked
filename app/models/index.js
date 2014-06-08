/*jslint node: true */
'use strict';

var Sequelize   = require('sequelize'),
    config      = require('config');

var sequelize = new Sequelize(config.db, config.dbuser, config.db, {
    dialect : config.dbtype,
    port    : config.dbport,
    //logging : function(){}, 
});

module.exports = sequelize;