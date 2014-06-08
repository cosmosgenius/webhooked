/*jslint node: true */
'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('App', {
        name: DataTypes.STRING,
        path: DataTypes.STRING(32000)
    });
};