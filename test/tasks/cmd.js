/*jslint node: true */
/*jshint expr: true*/
/*global describe, it*/
'use strict';

var cmd     = require('../../app/tasks/cmd'),
    should  = require('should');

describe('cmd', function() {
    it('should exist', function(){
        should.exist(cmd);
    });

    it('should return a function', function(){
        cmd('grunt').should.be.a.Function;
    });

    it('should throw type error if parameter is null', function(){
        cmd.bind(null).should.throw(TypeError);
    });

    it('should throw type error if parameter is object or function', function(){
        cmd.bind(null,{}).should.throw(TypeError);
        cmd.bind(null,function(){}).should.throw(TypeError);
    });
});