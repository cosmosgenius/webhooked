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

var models = {
    App : sequelize.import('./app'),
    Task: sequelize.import('./task')
};

module.exports.models = models;

models.App.hasMany(models.Task);
models.Task.belongsTo(models.App);
