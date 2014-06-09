/*jslint node: true */
'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Task', {
        name: DataTypes.STRING,
        AppId: {
            type            : DataTypes.INTEGER,
            references      : 'Apps',
            referencesKeyy  : 'id',
            onDelete        : 'cascade'
        }
    });
};