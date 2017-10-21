const Level = require('level');
const Sublevel = require('level-sublevel');
const Promise = require('bluebird');

class Store {
    constructor(db) {
        this.db = db;
    }

    put(key, value) {
        return Promise.fromCallback((cb) => {
            this.db.put(key, value, cb);
        });
    }

    get(key) {
        return Promise.fromCallback((cb) => {
            this.db.get(key, cb);
        });
    }

    del(key) {
        return Promise.fromCallback((cb) => {
            this.db.del(key, cb);
        });
    }

    substore(prefix) {
        return new Store((this.db.sublevel(prefix)));
    }

    createReadStream() {
        return this.db.createReadStream();
    }
}

const leveldb = Sublevel(Level(process.env.DB_PATH || './webhookeddb', {
    'valueEncoding': 'json'
}));

module.exports = new Store(leveldb);
