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
                if(err) {
                    return reject(err);
                }
                resolve(value);
            });
        });
    }

    del (key) {
        return new Promise((resolve, reject) => {
            this.db.del(key, (err) => {
                if(err) return reject(err);
                resolve();
            });
        });
    }

    createReadStream() {
        return this.db.createReadStream();
    }
}

module.exports = new Store();
