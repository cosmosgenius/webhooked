const KoaRouter = require('koa-router');
const Deploy = require('./model');
const deployapi = new KoaRouter();

deployapi
    .param('deployid', paramDeploy)
    .get('/', getList)
    .post('/', createInstance)
    .get('/:deployid', getInstance)
    .delete('/:deployid', deleteInstance);

async function getList(ctx) {
    ctx.body = Deploy.find();
    ctx.type = 'application/stream';
}

async function createInstance(ctx) {
    ctx.body = ctx.hook;
    ctx.status = 201;
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

module.exports = deployapi;
