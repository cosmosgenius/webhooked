'use strict';
const co = require('co');
const level = require('level');

class Store {
    constructor() {
        this.db = level(process.env.DB_PATH || './db', {
            'valueEncoding': 'json'
        });
    }

    put (key, value) {
        return new Promise((resolve, reject) => {
            this.db.put(key, value, (err) => {
                if (err) return reject(err);
                resolve(value);
            });
        });
    }

    get (key) {
        return new Promise((resolve, reject) => {
            this.db.get(key, (err, value) => {
                if(err) return reject(err);
                resolve(value);
            });
        });
    }
}

let db = new Store();

class Model {
    constructor (id) {
        this.id = id;
    }

    save() {
        const key = this.getKey();
        let values = {};

        for(let vkey in this) {
            values[vkey] = this[vkey];
        }
        return db.put(key, values);
    }

    getKey() {
        return `${this.constructor.name.toLowerCase()}:${this.id}`;
    }
}

Model.findById = co.wrap(function* (id) {
    let key = `${this.name.toLowerCase()}:${id}`;
    let obj = yield db.get(key);

    let vobj = new this(obj.id);

    for(let vkey in obj) {
        vobj[vkey] = obj[vkey];
    }

    return vobj;
});

db.Model = Model;

module.exports = db;
