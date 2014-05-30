/*jslint node: true */
/*jshint expr: true*/
/*global describe, it*/
'use strict';

var cmd     = require('../../app/tasks/cmd'),
    should  = require('should');

describe('cmd', function() {
    it('cmd should exist', function(){
        should.exist(cmd);
    });

    it('cmd should return a function', function(){
        cmd('grunt').should.be.a.Function;
    });

    it('cmd should throw type error if parameter not string', function(){

    });
});