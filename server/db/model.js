'use strict';

const co = require('co');
const db = require('./store');

class Model {
    constructor (id) {
        this.id = id;
    }

    save() {
        const key = this.getKey();
        let values = this.toJSON();
        return db.put(key, values);
    }

    delete () {
        const key = this.getKey();
        return db.del(key);
    }

    getKey() {
        return `${this.constructor.name.toLowerCase()}:${this.id}`;
    }

    toJSON() {
        let retobj = {};

        for (let vkey in this) {
            retobj[vkey] = this[vkey];
        }

        return retobj;
    }
}

Model.findById = co.wrap(function* (id) {
    let key = `${this.name.toLowerCase()}:${id}`;
    let obj = yield db.get(key);

    return this.fromObj(obj);
});

Model.fromObj = function(obj) {
    let instance = new this(obj.id);

    for (let vkey in obj) {
        instance[vkey] = obj[vkey];
    }

    return instance;
};

Model.getObjorNone = co.wrap(function* (id) {
    try {
        let obj = yield this.findById(id);
        return obj;
    } catch(err) {
        if(err.type !== 'NotFoundError') {
            throw err;
        }
    }
});

module.exports = Model;
