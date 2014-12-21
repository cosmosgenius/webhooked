/*global describe, it, before*/
"use strict";

var path = require("../../app/utils/path"),
    should = require("should");

describe("path", function() {
    it("should exist", function() {
        should.exist(path);
    });

    it("should return a function", function() {
        path(".").should.be.a.Function;
    });

    it("should return a function if parameter is null", function() {
        path().should.be.a.Function;
    });

    it("should throw type error if parameter is object or function", function() {
        path.bind(null, {}).should.throw(TypeError);
    });

    it("should throw type error if parameter function", function() {
        path.bind(null, function() {}).should.throw(TypeError);
    });
});

describe("path current", function() {
    var current;
    before(function() {
        current = path(".");
    });

    it("should return a promise", function(done) {
        current("ls",function(err, output){
            should.exist(output);
            done();
        });
    });

    it("should throw type error if parameter is null", function() {
        current.bind(null).should.throw(TypeError);
    });

    it("should throw type error if parameter is object", function() {
        current.bind(null, {}).should.throw(TypeError);
    });

    it("should throw type error if parameter is function", function() {
        current.bind(null, function() {}).should.throw(TypeError);
    });
});

describe("path resolve/reject", function() {
    var current;
    before(function() {
        current = path(".");
    });

    it("should resolve when command is successfull", function(done){
        current("dir", done);
    });

    it("should reject when command is not successfull", function(done){
        current("1234", function(err,result){
            should.exist(err);
            done(result);
        });
    });
});