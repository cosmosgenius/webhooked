/*jslint node: true */
'use strict';

var Sequelize   = require('sequelize'),
    config      = require('../../instance/config');

var sequelize = new Sequelize(config.db, config.dbuser, config.db, {
    dialect : config.dbtype,
    port    : config.dbport,
    logging : function(){}, 
});

module.exports = sequelize;
module.exports.App = sequelize.import('./app');