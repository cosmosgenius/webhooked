/*global describe, it, before, after */
"use strict";

var request = require("supertest"),
    should = require("should"),
    sinon = require("sinon"),
    app = require("../app"),
    process = require("child_process"),
    App = require("../app/models/app.model"),
    Log = require("../app/models/log.model");

request = request(app);

var sandbox;

describe("/deploy", function() {
    before(function(){
        sandbox = sinon.sandbox.create();
    });

    after(function(){
        sandbox.restore();
    });

    describe("get", function() {
        it("should return 200 with 1 object", function(done) {
            var stubapp = sandbox.stub(App, "find", function(crea, projection, cb) {
                cb(null, [{
                    name: "test",
                    path: "test",
                    tasks: ["a","b"],
                    created_at: new Date(),
                    modified_at: new Date()
                }]);
            });

            request
                .get("/deploy")
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.instanceOf(Array);
                    res.body.should.have.length(1);
                    var app_res = res.body[0];
                    app_res.name.should.be.equal("test");
                    app_res.path.should.be.equal("test");
                    app_res.tasks.should.eql(["a","b"]);
                    should.exist(app_res.created_at);
                    should.exist(app_res.modified_at);
                    stubapp.restore();
                    done();
                });
        });
    });
});

describe("/deploy/:app", function() {
    before(function(){
        sandbox = sinon.sandbox.create();
    });

    after(function(){
        sandbox.restore();
    });

    describe("get", function() {
        it("should return 404 when app doesn\"t exist", function(done) {
            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appdoesnotexist");
                cb();
            });

            request
                .get("/deploy/appdoesnotexist")
                .expect(404)
                .end(function(err, res) {
                    res.body.message.should.equal("App doesn't exist");
                    stubapp.restore();
                    done(err);
                });
        });

        it("should return the app", function(done) {
            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, {
                    name: "test",
                    path: "test",
                    tasks: ["a","b"],
                    created_at: new Date(),
                    modified_at: new Date()
                });
            });

            var stublog = sandbox.stub(Log, "find", function(crea, projection, cb) {
                cb(null, [{
                    app : "appexist",
                    outputs : [
                        {
                            task: "task1",
                            output: "output1"
                        },
                        {
                            task: "task2",
                            output: "output2"
                        }
                    ],
                    created_at: new Date(),
                    modified_at: new Date()
                }]);
            });

            request
                .get("/deploy/appexist")
                .expect(200)
                .end(function(err, res) {
                    var logs = res.body[0];
                    logs.app.should.equal("appexist");
                    logs.outputs[0].task.should.equal("task1");
                    logs.outputs[0].output.should.equal("output1");
                    logs.outputs[1].task.should.equal("task2");
                    logs.outputs[1].output.should.equal("output2");
                    stubapp.restore();
                    stublog.restore();
                    done(err);
                });
        });   
    });

    describe("post", function() {
        it("should execute the given tasks and store in db", function(done) {
            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, {
                    name: "appexist",
                    path: "test",
                    tasks: ["task1","task2"],
                    created_at: new Date(),
                    modified_at: new Date()
                });
            });

            var stublog = sandbox.stub(Log.prototype, "save", function(cb) {
                cb(null, [{
                    app : "appexist",
                    outputs : [
                        {
                            task: "task1",
                            output: "output1"
                        },
                        {
                            task: "task2",
                            output: "output2"
                        }
                    ],
                    created_at: new Date(),
                    modified_at: new Date()
                }]);
            });

            var stubexec = sandbox.stub(process, "exec", function(cmd, options, cb) {
                if(cmd === "task1") {
                    return cb(null, "output1");
                }

                if(cmd === "task2") {
                    return cb(null, "output2");
                }
            });

            request
                .post("/deploy/appexist")
                .send()
                .expect(201)
                .end(function(err, res) {
                    var logs = res.body[0];
                    logs.app.should.equal("appexist");
                    logs.outputs[0].task.should.equal("task1");
                    logs.outputs[0].output.should.equal("output1");
                    logs.outputs[1].task.should.equal("task2");
                    logs.outputs[1].output.should.equal("output2");
                    stubapp.restore();
                    stublog.restore();
                    stubexec.restore();
                    done(err);
                });
        });

        it("should handle execution errors", function(done) {
            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, {
                    name: "appexist",
                    path: "test",
                    tasks: ["task1","task2"],
                    created_at: new Date(),
                    modified_at: new Date()
                });
            });

            var stubexec = sandbox.stub(process, "exec", function(cmd, options, cb) {
                if(cmd === "task1") {
                    return cb(null, "output1");
                }

                if(cmd === "task2") {
                    return cb({message: "an error has occured"});
                }
            });

            request
                .post("/deploy/appexist")
                .send()
                .expect(400)
                .end(function(err, res) {
                    var postres = res.body;
                    postres.status.should.equal(400);
                    postres.message.should.equal("an error has occured");
                    stubapp.restore();
                    stubexec.restore();
                    done(err);
                });
        });
        
        it("should handle other errors", function(done) {
            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, {
                    name: "appexist",
                    path: "test",
                    tasks: ["task1","task2"],
                    created_at: new Date(),
                    modified_at: new Date()
                });
            });

            var stublog = sandbox.stub(Log.prototype, "save", function(cb) {
                cb({
                    errors: "an error has occured"
                });
            });

            var stubexec = sandbox.stub(process, "exec", function(cmd, options, cb) {
                if(cmd === "task1") {
                    return cb(null, "output1");
                }

                if(cmd === "task2") {
                    return cb(null, "output2");
                }
            });

            request
                .post("/deploy/appexist")
                .send()
                .expect(400)
                .end(function(err, res) {
                    var postres = res.body;
                    postres.status.should.equal(400);
                    postres.message.should.equal("an error has occured");
                    stubapp.restore();
                    stublog.restore();
                    stubexec.restore();
                    done(err);
                });
        });      
    }); 
});