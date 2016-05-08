'use strict';

const Koa = require('koa');
const etag = require('koa-etag');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const responseTime = require('koa-response-time');

let app =  new Koa();

const hookapi = require('./hook');
let route = new KoaRouter();

route.use('/hooks', hookapi.routes(), hookapi.allowedMethods());

app
    .use(console.reqLogger())
    .use(responseTime())
    .use(etag())
    .use(bodyParser())
    .use(route.routes())
    .use(route.allowedMethods());

module.exports = app;
