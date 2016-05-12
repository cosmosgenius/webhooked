'use strict';

const db = require('./store');
const Model = require('./model');
const Serializer = require('./serializer');
const ValidationError = require('./validation').ValidationError;

db.Model = Model;
db.Serializer = Serializer;
db.ValidationError = ValidationError;

module.exports = db;
