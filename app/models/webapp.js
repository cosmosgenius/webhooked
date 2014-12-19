"use strict";

module.exports = function(db) {
    var webapps = db.get("webapps");
    webapps.index("name");
    
    return {
        create: function(specs) {

        },
        delete: function() {

        },
        find: function(params) {

        },
        update: function() {

        }
    };

};