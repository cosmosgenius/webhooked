const KoaRouter = require('koa-router');
const Hook = require('./model');
const HookSerializer = require('./serializer');

const deployapi = require('../deploy');

const hookapi = new KoaRouter();

hookapi
    .param('hook', paramHook)
    .get('/', getList)
    .post('/', createInstance)
    .get('/:hook', getInstance)
    .put('/:hook', updateInstance)
    .delete('/:hook', deleteInstance);

async function getList(ctx) {
    ctx.body = Hook.find();
    ctx.type = 'application/stream';
}

async function createInstance(ctx) {
    const ser = new HookSerializer({
        data: ctx.request.body
    });
    await ser.is_valid();
    const hook = Hook.fromObj(ser.data);
    await hook.save();
    ctx.body = ser.data;
    ctx.status = 201;
}

async function paramHook(id, ctx, next) {
    const obj = await Hook.findById(id);
    ctx.hook = obj;
    return next();
}

async function getInstance(ctx) {
    ctx.body = ctx.hook;
}

async function updateInstance(ctx) {
    const ser = new HookSerializer({
        data: ctx.request.body,
        partial: true
    });
    await ser.is_valid();
    ctx.hook.update(ser.data);
    ctx.body = ctx.hook;
}

async function deleteInstance(ctx) {
    await ctx.hook.delete();
    ctx.status = 204;
}

hookapi.use('/:hook/deploy', deployapi.routes(), deployapi.allowedMethods());

module.exports = hookapi;
