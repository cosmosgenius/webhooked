const level = require('level');
const Promise = require('bluebird');

class Store {
    constructor() {
        this.db = level(process.env.DB_PATH || './db', {
            'valueEncoding': 'json'
        });
    }

    put (key, value) {
        return Promise.fromCallback((cb) => {
            this.db.put(key, value, cb);
        });
    }

    get (key) {
        return Promise.fromCallback((cb) => {
            this.db.get(key, cb);
        });
    }

    del (key) {
        return Promise.fromCallback((cb) => {
            this.db.del(key, cb);
        });
    }

    createReadStream() {
        return this.db.createReadStream();
    }
}

module.exports = new Store();
