/*jslint node: true */
'use strict';

var exec    = require('child_process').exec,
    Q       = require('q');

module.exports = function( command ){
    
    if(typeof command !== 'string'){
        throw new TypeError('command should be of type string');
    }

    return function( path ){

        if( !path ){
            path = '.';
        }

        if( typeof command !== 'string' ){
            throw new TypeError('command should be of type string');
        }

        Q.Promise(function(resolve, reject, notify){

            exec(command,function(error){
                if(error){
                    reject(error);
                }
                resolve();
            });

            notify();
        });
    };
};