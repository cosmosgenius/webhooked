'use strict';

const Koa = require('koa');
const KoaRouter = require('koa-router');
const co = require('co');

let app =  new Koa();

let route = new KoaRouter();

route.get('/', co.wrap(function* (ctx, next) {
    ctx.body = 'Hello World!';
    yield next();
}));

app
    .use(route.routes())
    .use(route.allowedMethods());

module.exports = app;
