const through2 = require('through2');
const db = require('./store');

class Model {
    constructor (id) {
        this.id = id;
    }

    save() {
        const key = this.getKey();
        const values = this.toJSON();
        return this.store.put(key, values);
    }

    delete () {
        const key = this.getKey();
        return this.store.del(key);
    }

    update (obj) {
        for (let vkey in obj) {
            this[vkey] = obj[vkey];
        }
        return this.save();
    }

    getKey() {
        return this.id;
    }

    toJSON() {
        const retobj = {};

        for (let vkey in this) {
            retobj[vkey] = this[vkey];
        }

        return retobj;
    }

    static async findById(key) {
        const obj = await this.store.get(key);
        return this.fromObj(obj);
    }

    static find ({limit= 10, gt} = {}) {
        const stream = this.store.createReadStream({
            limit: limit
        }).pipe(through2.obj(modelmapper));
        return stream;
    }

    static fromObj (obj) {
        const instance = new this(obj.id);
        for (let vkey in obj) {
            instance[vkey] = obj[vkey];
        }

        return instance;
    }

    static async getObjorNone(id) {
        try {
            const obj = await this.findById(id);
            return obj;
        } catch(err) {
            if(err.type !== 'NotFoundError') {
                throw err;
            }
        }
    }

    static get prefix() {
        return this.name.toLowerCase() + 's';
    }

    static get store() {
        return db.substore(this.prefix);
    }

    get store() {
        return this.constructor.store;
    }
}

const modelmapper = function(chuck, enc, cb){
    this.push(JSON.stringify(chuck.value));
    cb();
};

module.exports = Model;
