/*global describe, it, before, after */
"use strict";

var process = require("child_process"),
    request = require("supertest"),
    sinon = require("sinon"),
    should = require("should"),
    app = require("../app"),
    App = require("../app/models/app.model"),
    Log = require("../app/models/log.model");

request = request(app);

var sandbox;

describe("/", function() {
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
                .get("/")
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

    describe("post", function() {
        it("should return 201 and call model save method with valid data", function(done) {
            var instance = {
                    name: "test1",
                    path: "test1",
                    tasks: ["abc", "bcd"]
                };

            var stubapp = sandbox.stub(App.prototype, "save", function(cb) {
                cb(null,instance);
            });

            request
                .post("/")
                .send(instance)
                .expect(201)
                .expect("location", instance.name)
                .end(function(err, res) {
                    var postres = res.body;
                    postres.name.should.equal(instance.name);
                    postres.path.should.equal(instance.path);
                    postres.tasks.should.eql(instance.tasks);
                    stubapp.restore();
                    done(err);
                });
        });

        it("should handle 11000 error code when app already exist", function(done) {
            var instance = {
                    name: "test1",
                    path: "test1",
                    tasks: ["abc", "bcd"]
                };

            var stubapp = sandbox.stub(App.prototype, "save", function(cb) {
                var err = new Error();
                err.code = 11000;
                cb(err);
            });

            request
                .post("/")
                .send(instance)
                .expect(400)
                .end(function(err, res) {
                    var postres = res.body;
                    postres.status.should.equal(400);
                    postres.message.name.should.equal(instance.name);
                    stubapp.restore();
                    done(err);
                });
        });

        it("should handle other errors", function(done) {
            var instance = {
                    name: "test1",
                    path: "test1",
                    tasks: ["abc", "bcd"]
                };

            var stubapp = sandbox.stub(App.prototype, "save", function(cb) {
                var err = new Error();
                err.errors ="an error has occured";
                cb(err);
            });

            request
                .post("/")
                .send(instance)
                .expect(400)
                .end(function(err, res) {
                    var postres = res.body;
                    postres.status.should.equal(400);
                    postres.message.should.equal("an error has occured");
                    stubapp.restore();
                    done(err);
                });
        });
    });

    describe("put delete", function() {
        it("should return 405", function(done) {
            request
                .put("/")
                .set("Content-Type", "application/json")
                .send()
                .expect(405,done);
        });

        it("should return 405", function(done) {
            request
                .delete("/")
                .set("Content-Type", "application/json")
                .send()
                .expect(405,done);
        });
    });
});

describe("/:app", function() {
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
                .get("/appdoesnotexist")
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

            request
                .get("/appexist")
                .expect(200)
                .end(function(err, res) {
                    var postres = res.body;
                    postres.name.should.equal("test");
                    postres.path.should.equal("test");
                    postres.tasks.should.eql(["a","b"]);
                    stubapp.restore();
                    done(err);
                });
        });
    });

    describe("put", function() {
        it("should return the updated app", function(done) {
            var instance = {
                    name: "test",
                    path: "test",
                    tasks: ["a","b"],
                    save: function(cb){
                        cb(null,instance);
                    }
                };

            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, instance);
            });

            request
                .put("/appexist")
                .expect(200)
                .send({
                    path: "newpath"
                })
                .end(function(err, res) {
                    var postres = res.body;
                    postres.name.should.equal("test");
                    postres.path.should.equal("newpath");
                    postres.tasks.should.eql(["a","b"]);
                    stubapp.restore();
                    done(err);
                });
        });

        it("should return 400 when trying to update name", function(done) {
            var instance = {
                    name: "test",
                    path: "test",
                    tasks: ["a","b"],
                    save: function(cb){
                        cb(null,instance);
                    }
                };

            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, instance);
            });

            request
                .put("/appexist")
                .expect(400)
                .send({
                    name: "newpath"
                })
                .end(function(err, res) {
                    var postres = res.body;
                    postres.message.should.equal("Cannot modify name");
                    stubapp.restore();
                    done(err);
                });
        });

        it("should return 400 when error occurs while saving", function(done) {
            var instance = {
                    name: "test",
                    path: "test",
                    tasks: ["a","b"],
                    save: function(cb){
                        cb({errors: "error occured"});
                    }
                };

            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, instance);
            });

            request
                .put("/appexist")
                .expect(400)
                .send({
                    path: "newpath"
                })
                .end(function(err, res) {
                    var postres = res.body;
                    postres.message.should.equal("error occured");
                    stubapp.restore();
                    done(err);
                });
        });
    });

    describe("delete", function() {
        it("should return 204, delete app and its logs", function(done) {
            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, {
                    name: "test",
                    path: "test",
                    tasks: ["a","b"],
                    remove: function(cb){
                        cb();
                    }
                });
            });

            var stublog = sandbox.stub(Log, "remove", function(crea, cb){
                crea.app.should.equal("test");
                cb();
            });

            request
                .delete("/appexist")
                .expect(204)
                .end(function(err) {
                    stublog.restore();
                    stubapp.restore();
                    done(err);
                });
        });

        it("should return 500 with error", function(done) {
            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, {
                    name: "test",
                    path: "test",
                    tasks: ["a","b"],
                    remove: function(cb){
                        cb({
                            errors: "an error has occured"
                        });
                    }
                });
            });

            request
                .delete("/appexist")
                .expect(500)
                .end(function(err, res) {
                    res.body.message.errors.should.be.equal("an error has occured");
                    stubapp.restore();
                    done(err);
                });
        });

        it("should return 500 with error for log delete errors", function(done) {
            var stubapp = sandbox.stub(App, "findOne", function(crea, cb) {
                crea.name.should.equal("appexist");
                cb(null, {
                    name: "test",
                    path: "test",
                    tasks: ["a","b"],
                    remove: function(cb){
                        cb();
                    }
                });
            });

            var stublog = sandbox.stub(Log, "remove", function(crea, cb){
                crea.app.should.equal("test");
                cb({
                    errors: "an error has occured"
                });
            });

            request
                .delete("/appexist")
                .expect(500)
                .end(function(err, res) {
                    res.body.message.errors.should.be.equal("an error has occured");
                    stublog.restore();
                    stubapp.restore();
                    done(err);
                });
        });
    });
});

describe("/:app/deploy", function() {
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
                .get("/appdoesnotexist/deploy")
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
                .get("/appexist/deploy")
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
                .post("/appexist/deploy")
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
                .post("/appexist/deploy")
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
                var err = new Error();
                err.errors = "an error has occured";
                cb(err);
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
                .post("/appexist/deploy")
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
