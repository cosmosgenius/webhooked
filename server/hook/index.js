'use strict';

const co = require('co');
const KoaRouter = require('koa-router');
const Hook = require('./model');
const HookSerializer = require('./serializer');

let hookapi = new KoaRouter();

hookapi
    .param('hook', co.wrap(paramHook))
    .get('/')
    .post('/', co.wrap(createInstance))
    .get('/:hook', co.wrap(getInstance))
    .put('/:hook', co.wrap(updateInstance))
    .delete('/:hook', co.wrap(deleteInstance));

function* createInstance(ctx) {
    let ser = new HookSerializer(ctx.request.body);
    yield ser.is_valid();
    let hook = Hook.fromObj(ser.data);
    yield hook.save();
    ctx.body = ser.data;
    ctx.status = 201;
}

function* paramHook(id, ctx, next) {
    let obj = yield Hook.findById(id);
    ctx.hook = obj;
    yield next();
}

function* getInstance(ctx) {
    ctx.body = ctx.hook;
}

function* updateInstance(ctx) {
    ctx.body = ctx.request.body;
}

function* deleteInstance(ctx) {
    yield ctx.hook.delete();
    ctx.status = 204;
}


module.exports = hookapi;
