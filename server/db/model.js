'use strict';

const co = require('co');
const through2 = require('through2');
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

    update (obj) {
        for (let vkey in obj) {
            this[vkey] = obj[vkey];
        }
        return this.save();
    }

    getKey() {
        return this.constructor.getKey(this.id);
    }

    toJSON() {
        let retobj = {};

        for (let vkey in this) {
            retobj[vkey] = this[vkey];
        }

        return retobj;
    }

    static getBase () {
        return `${this.name.toLowerCase()}:`;
    }

    static getKey (id) {
        return `${this.getBase()}${id}`;
    }
}

Model.findById = co.wrap(function* (id) {
    let key = this.getKey(id);
    let obj = yield db.get(key);

    return this.fromObj(obj);
});

Model.find = function() {
    let stream = db.createReadStream();
    return stream.pipe(modelmapper);
};

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

const modelmapper = through2.obj(function(chuck, enc, cb){
    this.push(chuck.value);
    cb();
});

module.exports = Model;
