"use strict";

var express         = require("express"),
    cors            = require("cors"),
    app             = express();

var webapps         = require("./routes/webapps");
    

app.use(cors());
app.use("/",webapps);

module.exports = app;