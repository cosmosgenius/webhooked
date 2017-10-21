const db = require('../db');
const Hook = require('./model.js');

class HookSerializer extends db.Serializer {
    constructor({data, partial}) {
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

    async validate_id(id) {
        let obj = await Hook.getObjorNone(id);
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
    }

    async validate_path(path) {
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
    }

    async validate_name(name) {
        if(!name) {
            throw new db.ValidationError('name is required');
        }

        if(typeof name !== 'string') {
            throw new db.ValidationError('name should be string');
        }

        return name;
    }

    async validate_commands(commands) {
        if(!(commands instanceof Array)) {
            throw new db.ValidationError('commands should be a array');
        }
        return commands;
    }
}

module.exports = HookSerializer;
