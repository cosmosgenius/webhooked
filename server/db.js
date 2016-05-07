'use strict';
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

let db = new Store;

class Model {
    constructor (id) {
        this.id = id;
    }

    validate () {}

    save() {
        this.validate();
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

    static findById (id) {
        let key = `${this.name.toLowerCase()}:${id}`;

        return db.get(key)
                .then((obj)=>{
                    let vobj = new this(obj.id);
                    for(let vkey in obj) {
                        vobj[vkey] = obj[vkey];
                    }
                    return vobj;
                });
    }
}

db.Model = Model;

module.exports = db;
