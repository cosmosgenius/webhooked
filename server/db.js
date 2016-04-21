'use strict';
const level = require('level');

let db = level(process.env.DB_PATH || './db', {
    'valueEncoding': 'json'
});

class Model {
    constructor (id) {
        this.id = id;
    }

    save() {
        return new Promise((resolve, reject) => {
            if(this.validate) this.validate();
            let key = this.getKey();
            let val = {};

            for(let vkey in this) {
                val[vkey] = this[vkey];
            }

            db.put(key, val, (err)=> {
                if(err) return reject(err);
                resolve(this);
            });
        });
    }

    getKey() {
        return `${this.constructor.name.toLowerCase()}:${this.id}`;
    }

    static findById(id) {
        let key = `${this.name.toLowerCase()}:${id}`;
        return new Promise((resolve, reject) => {
            db.get(key, (err, obj) => {
                if(err) return reject(err);

                let vobj = new this(obj.id);

                for(let vkey in obj) {
                    vobj[vkey] = obj[vkey];
                }
                resolve(vobj);
            });
        });
    }
}

db.Model = Model;

module.exports = db;
