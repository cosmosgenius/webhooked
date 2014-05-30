/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before*/
'use strict';

var cmd     = require('../../app/utils/cmd'),
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
    });

    it('should throw type error if parameter function', function(){
        cmd.bind(null,function(){}).should.throw(TypeError);
    });
});

describe('cmd ls', function() {
    var ls;
    before(function(){
        ls = cmd('ls');
    });

    it('should return a promise', function(){
        var promise = ls();
        should.exist(promise);
        should.exist(promise.then);
        promise.then.should.be.a.Function;
    });

    it('should throw type error if parameter is object', function(){
        ls.bind(null,{}).should.throw(TypeError);
    });

    it('should throw type error if parameter is function', function(){
        ls.bind(null,function(){}).should.throw(TypeError);
    });
});