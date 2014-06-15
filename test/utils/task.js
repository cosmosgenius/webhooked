/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before*/
'use strict';

var task = require('../../app/utils/task'),
    should = require('should');

describe('task', function() {
    it('should exist', function() {
        should.exist(task);
    });

    it('should return a function', function() {
        task('.').should.be.a.Function;
    });

    it('should return a function if parameter is null', function() {
        task().should.be.a.Function;
    });

    it('should throw type error if parameter is object or function', function() {
        task.bind(null, {}).should.throw(TypeError);
    });

    it('should throw type error if parameter function', function() {
        task.bind(null, function() {}).should.throw(TypeError);
    });
});

describe('task current', function() {
    var current;
    before(function() {
        current = task('.');
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