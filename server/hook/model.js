'use strict';

var Document = require('camo').Document;

var connect = require('camo').connect;

var database;
var uri = 'nedb://memory';

connect(uri).then(function(db) {
    database = db;
});

class Hook extends Document {
    constructor() {
        super();

        this.name = {
            type: String,
            require: true
        };

        this.path = {
            type: String,
            require: true
        };

        this.created_at  = {
            type: Date,
            default: Date.now
        };
    }

    static collectionName() {
        return 'companies';
    }
}

module.exports = Hook;
