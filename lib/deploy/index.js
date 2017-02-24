const KoaRouter = require('koa-router');
const {path} = require('../utils');
// const Deploy = require('./model');
const deployapi = new KoaRouter();

deployapi
    .param('deployid', paramDeploy)
    // .get('/', getList)
    .post('/', createInstance)
    // .get('/:deployid', getInstance)
    // .delete('/:deployid', deleteInstance);

async function getList(ctx) {
    ctx.body = Deploy.find();
    ctx.type = 'application/stream';
}

async function createInstance(ctx) {
    const {commands} = ctx.hook;
    const deploypath = ctx.hook.path;
    deploy(deploypath, commands);
    ctx.status = 202;
}

async function paramDeploy(id, ctx, next) {
    const obj = await Deploy.findById(id);
    ctx.deploy = obj;
    return next();
}

async function getInstance(ctx) {
    ctx.body = ctx.deploy;
}

async function deleteInstance(ctx) {
    await ctx.deploy.delete();
    ctx.status = 204;
}

async function deploy(deploypath, commands) {
    const execute = path(deploypath);

    for (var command of commands) {
        var result = await execute(command);
    }
}

module.exports = deployapi;
