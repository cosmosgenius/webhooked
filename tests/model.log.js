/*global describe, it, before, after*/
"use strict";

var should = require("should"),
    db = require("../app/models"),
    Log = db.Log;

describe("Model Log",function() {
    before(function(done) {
        Log.remove(done);
    });

    describe("addOutput", function() {
        it("should add the given task and output to the log", function(done) {
            var alog = new Log({
                app : "test"
            });

            alog.save(function(err, alog){
                should.not.exist(err);
                alog.app.should.eql("test");
                alog.addOutput("task1","output1");
                alog.addOutput("task2","output2");
                alog.save(function(){
                    Log.find({app: "test"}, function(err, logs){
                        should.exist(logs);
                        logs.length.should.eql(1);
                        var outputs = logs[0].outputs;
                        outputs[0].task.should.eql("task1");
                        outputs[0].output.should.eql("output1");
                        outputs[1].task.should.eql("task2");
                        outputs[1].output.should.eql("output2");
                        done();
                    });
                });
            });
        });
    });

    after(function(done) {
        Log.remove(done);
    });
});