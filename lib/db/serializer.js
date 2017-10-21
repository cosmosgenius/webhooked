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

    getFields() {
        if(this._partial) {
            const fields =  this.fields.filter((field) => this._data[field]);

            if(fields.includes('id')){
                throw new ValidationError('cannot modify id');
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

    async is_valid() {
        if(this._instance) return true;
        const src = this._data;

        const obj = {};
        const errors = [];

        for (let field of this.getFields()) {
            const validator = this[`validate_${field}`] || (async (value) => value);
            try {
                obj[field] = await validator(src[field]);
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
    }
}

module.exports = Serializer;
