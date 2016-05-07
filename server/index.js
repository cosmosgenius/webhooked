'use strict';

const Koa = require('koa');
const KoaRouter = require('koa-router');
const responseTime = require('koa-response-time');
const bodyParser = require('koa-bodyparser');
const etag = require('koa-etag');
const co = require('co');

let app =  new Koa();

let route = new KoaRouter();

route.get('/', co.wrap(function* (ctx, next) {
    ctx.body = 'Hello World!';
    yield next();
}));

app
    .use(responseTime())
    .use(etag())
    .use(bodyParser())
    .use(route.routes())
    .use(route.allowedMethods());

module.exports = app;
