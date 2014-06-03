/*jslint node: true */
var config      = {};


config.port     = 8000;
config.env      = process.env.NODE_ENV || 'development';
config.db       = 'whkd';
config.dbuser   = 'postgres';
config.dbpass   = null;
config.dbtype   = 'postgres';
config.dbport   = 5432;

if (config.env  === 'test') {
    config.port     = 8500;
    config.db       = 'whkd_test';
}

module.exports  = config;