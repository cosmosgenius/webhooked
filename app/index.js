"use strict";

var express         = require("express"),
    cors            = require("cors"),
    app             = express();

var webapps         = require("./routes/webapps"),
    deploy          = require("./routes/deploy");
    

app.use(cors());
app.use("/webapps",webapps);
app.use("/deploy",deploy);

module.exports = app;