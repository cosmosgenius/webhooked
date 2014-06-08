/*jslint node: true */
var config      = {};


config.port     = 8000;
config.env      = process.env.NODE_ENV || 'development';
config.db       = 'whkd';
config.dbuser   = 'postgres';
config.dbpass   = null;
config.dbtype   = 'postgres';
config.dbport   = 5432;

module.exports  = config;