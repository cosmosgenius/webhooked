'use strict';

const co = require('co');
const Koa = require('koa');
const etag = require('koa-etag');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const responseTime = require('koa-response-time');

let app =  new Koa();

let route = new KoaRouter();

route.get('/', co.wrap(function* (ctx, next) {
    ctx.body = 'Hello World!';
    yield next();
}));

app
    .use(console.reqLogger())
    .use(responseTime())
    .use(etag())
    .use(bodyParser())
    .use(route.routes())
    .use(route.allowedMethods());

module.exports = app;
