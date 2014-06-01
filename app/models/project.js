/*jslint node: true */
'use strict';

var Sequelize   = require('sequelize');

module.exports = function(sequelize){

    var Project = sequelize.define('Project',{
        name: Sequelize.STRING
    });

    return Project;
};