/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before*/
'use strict';

var path = require('../../app/utils/path'),
    should = require('should');

describe('path', function() {
    it('should exist', function() {
        should.exist(path);
    });

    it('should return a function', function() {
        path('.').should.be.a.Function;
    });

    it('should return a function if parameter is null', function() {
        path().should.be.a.Function;
    });

    it('should throw type error if parameter is object or function', function() {
        path.bind(null, {}).should.throw(TypeError);
    });

    it('should throw type error if parameter function', function() {
        path.bind(null, function() {}).should.throw(TypeError);
    });
});

describe('path current', function() {
    var current;
    before(function() {
        current = path('.');
    });

    it('should return a promise', function() {
        var promise = current('ls');
        should.exist(promise);
        should.exist(promise.then);
        promise.then.should.be.a.Function;
    });

    it('should throw type error if parameter is null', function() {
        current.bind(null).should.throw(TypeError);
    });

    it('should throw type error if parameter is object', function() {
        current.bind(null, {}).should.throw(TypeError);
    });

    it('should throw type error if parameter is function', function() {
        current.bind(null, function() {}).should.throw(TypeError);
    });
});