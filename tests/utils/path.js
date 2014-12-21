/*global describe, it, before, after*/
"use strict";

var should = require("should"),
    sinon = require("sinon"),
    process = require("child_process");

var path = require("../../app/utils/path");

var exec;

var cmds = {
    working: "working",
    notworking: "notworking"
};

function execStub () {
    var _this = sinon.stub(process, "exec", function (cmd, options, cb) {
            _this.cmd = cmd;
            _this.path = options.cwd;

            if(cmd === cmds.working) {
                return cb(null,{});
            }
            return cb({});
        });
    return _this;
}

describe("path", function() {
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

describe("path callback", function() {
    var pathStr = ".",
        runCommand;

    before(function() {
        exec = execStub();
        runCommand = path(pathStr);
    });

    after(function() {
        exec.restore();
    });

    it("should callback with proper result when command is successfull", function(done){
        runCommand(cmds.working, function(err, result){
            should.not.exist(err);
            should.exist(result);
            exec.cmd.should.be.eql(cmds.working);
            exec.path.should.be.eql(pathStr);
            done();
        });
    });

    it("should reject when command is not successfull", function(done){
        runCommand(cmds.notworking, function(err){
            should.exist(err);
            exec.cmd.should.be.eql(cmds.notworking);
            exec.path.should.be.eql(pathStr);
            done();
        });
    });
});

describe("path current", function() {
    var current;
    before(function() {
        exec = execStub();
        current = path(".");
    });

    after(function() {
        exec.restore();
    });

    it("should return a promise", function(done) {
        current(cmds.working, function(err, output){
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

