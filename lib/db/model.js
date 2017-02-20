const through2 = require('through2');
const db = require('./store');

class Model {
    constructor (id) {
        this.id = id;
    }

    save() {
        const key = this.getKey();
        const values = this.toJSON();
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
        const retobj = {};

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

    static async findById(id) {
        const key = this.getKey(id);
        const obj = await db.get(key);
        return this.fromObj(obj);
    }

    static find () {
        const stream = db.createReadStream()
                .pipe(through2.obj(modelmapper));
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
}

const modelmapper = function(chuck, enc, cb){
    this.push(JSON.stringify(chuck.value));
    cb();
};

module.exports = Model;
