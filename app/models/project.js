/*jslint node: true */
'use strict';

var Sequelize   = require('sequelize'),
    sequelize   = require('./');

var Project     = sequelize.define('Project',{
    name: Sequelize.STRING
});

module.exports  = Project;