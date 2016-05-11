'use strict';

const co = require('co');

class Serializer {
    constructor(data, model) {
        this.model = model;
        if(data instanceof this.model) {
            this._instance = data;
        } else {
            this._data = data;
        }
        this.fields = [];
    }

    get data() {
        if(!this._validated_data) {
            throw Error('HookSerializer: is_valid not called');
        }
        return this.toJSON();
    }

    toJSON() {
        let src = this._instance ? this._instance
                    : this._validated_data ? this._validated_data : this._data;

        return this.fields.reduce((obj, field)=>{
            obj[field] = src[field];
            return obj;
        }, {});
    }

    test () {
        console.log(this.model);
    }
}

Serializer.prototype.is_valid = co.wrap(function* () {
    if(this._instance) return true;
    let src = this._data;
    const noop = co.wrap(function*(value) { return value; });

    let obj = {};
    for (let field of this.fields) {
        let validator = this[`validate_${field}`] || noop;
        obj[field] = yield validator(src[field]);
    }

    this._validated_data = obj;
    return true;
});

module.exports = Serializer;
