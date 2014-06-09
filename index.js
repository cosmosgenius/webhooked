/*jslint node: true */
'use strict';

var http    = require('http'),
    config  = require('config'),
    app     = require('./app'),
    server  = http.createServer(app);
    
var db      = app.get('db');

db.sync().complete(function() {
    server.listen(config.port, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
    });
});