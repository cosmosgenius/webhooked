'use strict';

const co = require('co');

const db = require('../db');
const Hook = require('./model.js');

class HookSerializer extends db.Serializer {
    constructor ({data, partial}) {
        super({
            data,
            partial
        });
        this.model = Hook;
        this.fields = [
            'id',
            'name',
            'path',
            'commands'
        ];
    }
}

HookSerializer.prototype.validate_id = co.wrap(function*(id) {
    let obj = yield Hook.getObjorNone(id);
    if(obj) {
        throw new db.ValidationError(`"${id}" already exists`);
    }

    if(!id) {
        throw new db.ValidationError('id is required');
    }

    if(typeof id !== 'string') {
        throw new db.ValidationError('id should be string');
    }
    return id;
});

HookSerializer.prototype.validate_path = co.wrap(function* (path) {

    if(!path) {
        throw new db.ValidationError('path is required');
    }
    path = path.trim();

    if(typeof path !== 'string') {
        throw new db.ValidationError('path should be string');
    }

    if(path.length < 1) {
        throw new db.ValidationError('path should have more than two characters');
    }
    return path;
});

HookSerializer.prototype.validate_name = co.wrap(function* (name) {
    if(!name) {
        throw new db.ValidationError('name is required');
    }

    if(typeof name !== 'string') {
        throw new db.ValidationError('name should be string');
    }

    return name;
});

HookSerializer.prototype.validate_commands = co.wrap(function* (commands) {
    if(!(commands instanceof Array)) {
        throw new db.ValidationError('commands should be a array');
    }
    return commands;
});

module.exports = HookSerializer;
