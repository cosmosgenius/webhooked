'use strict';

const db = require('./store');
const Model = require('./model');
const Serializer = require('./serializer');

db.Model = Model;
db.Serializer = Serializer;

class ValidationError extends Error {
    constructor (msg, status=400) {
        super(msg);
        this.status = status;
    }
}

db.ValidationError = ValidationError;

module.exports = db;
