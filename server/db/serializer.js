'use strict';

const co = require('co');
const ValidationError = require('./validation').ValidationError;

class Serializer {
    constructor({data, partial}) {
        this._partial = !!partial;
        this._data = data;
        this.fields = [];
    }

    get data() {
        if(!this._validated_data) {
            throw Error('HookSerializer: is_valid not called');
        }
        return this.toJSON();
    }

    getFields () {
        if(this._partial) {
            let fields =  this.fields.filter((field) => this._data[field]);

            if(fields.includes('id')){
                throw new ValidationError('cannot update id');
            }

            return fields;
        }
        return this.fields;
    }

    toJSON() {
        let src = this._validated_data ? this._validated_data : this._data;

        return this.getFields().reduce((obj, field)=>{
            obj[field] = src[field];
            return obj;
        }, {});
    }
}

const noop = co.wrap(function*(value) { return value; });

Serializer.prototype.is_valid = co.wrap(function* () {
    if(this._instance) return true;
    let src = this._data;

    let obj = {};
    let errors = [];

    for (let field of this.getFields()) {
        let validator = this[`validate_${field}`] || noop;
        try {
            obj[field] = yield validator(src[field]);
        } catch (err) {
            if(err instanceof ValidationError) {
                errors.push({
                    field,
                    message: err.message
                });
            } else {
                throw err;
            }
        }
    }

    if (errors.length) {
        throw new ValidationError(errors);
    }

    this._validated_data = obj;
    return true;
});

module.exports = Serializer;
