"use strict";

var http            = require("http"),
    config          = require("config"),
    app             = require("./app"),
    logger          = require("morgan"),
    responseTime    = require("response-time"),
    server          = http.createServer(app),
    modelManager    = require("./app/models"),
    env             = process.env.NODE_ENV || "development";

if("production" === env) {
    app.use(logger());
}

if("development" === env) {
    modelManager.debug(true);
    app.use(logger("dev"));
    app.use(responseTime(5));
}

server.listen(config.port, function(err) {
    if (err) {
        console.log(err);
    }
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});