/*jslint node: true */
var Sequelize   = require('sequelize'),
    config      = require('../../instance/config');

var sequelize = new Sequelize(config.db, config.dbuser, config.db, {
    dialect : config.dbtype,
    port    : config.dbport
});

module.exports = {
    models : {
        project : require('./project')(sequelize)
    }
};