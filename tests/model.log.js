/*global describe, it*/
"use strict";

var should = require("should"),
    Log = require("../app/models").Log;

describe("Model Log",function() {
    describe("addOutput", function() {
        it("should add the given task and output to the log", function() {
            var alog = new Log({
                app : "test"
            });

            alog.addOutput("task1","output1");
            alog.addOutput("task2","output2");

            var outputs = alog.outputs;
            outputs[0].task.should.eql("task1");
            outputs[0].output.should.eql("output1");
            outputs[1].task.should.eql("task2");
            outputs[1].output.should.eql("output2");
        });
    });

    describe("JSON structure", function() {
        it("should return json without __v", function() {
            var log = new Log({
                app: "app1",
                __v:0
            });
            should.exist(log.__v);
            should.not.exist(log.toJSON().__v);
        });
    });
});