/*global describe, it, before */
"use strict";

var request = require("supertest"),
    app = require("../app"),
    should = require("should"),
    db = require("../app/models"),
    ModelApp = db.App;

request = request(app);
describe("/webapps", function() {
    describe("app", function() {
        it("should exist", function() {
            should.exist(app);
        });
    });
});

describe("/webapps", function() {
    describe("get", function() {
        before(function(done) {
            ModelApp.remove(done);
        });

        it("should return 200 and should be empty", function(done) {
            request
                .get("/webapps")
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.instanceOf(Array);
                    res.body.should.have.length(0);
                    done(err);
                });
        });

        it("should return 200 with 1 object", function(done) {
            var app1 = new ModelApp({
                name: "test",
                path: "test",
                tasks: ["a", "b"]
            });

            app1.save(function(err, app_1) {
                if (err) {
                    done(err);
                }
                request
                    .get("/webapps")
                    .expect(200)
                    .end(function(err, res) {
                        res.body.should.be.an.instanceOf(Array);
                        res.body.should.have.length(1);
                        var app_res = res.body[0];
                        app_res._id.should.be.equal(app_1._id + "");
                        ModelApp.remove(done);
                    });
            });
        });
    });

    describe("post", function() {
        before(function(done) {
            ModelApp.remove(done);
        });

        it("should return 201 and should add the to db", function(done) {
            request
                .get("/webapps")
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        done(err);
                        return;
                    }
                    res.body.should.be.an.instanceOf(Array);
                    res.body.should.have.length(0);
                    request
                        .post("/webapps")
                        .send({
                            name: "test",
                            path: "test",
                            tasks: ["a", "b"]
                        })
                        .expect(201)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            var postres = res.body;
                            request
                                .get("/webapps")
                                .expect(200)
                                .end(function(err, res) {
                                    res.body.should.be.an.instanceOf(Array);
                                    res.body.should.have.length(1);
                                    postres._id.should.be.equal(res.body[0]._id);
                                    done(err);
                                });
                        });
                });
        });

        it("should return 400 for invalid post", function(done) {
            request
                .post("/webapps")
                .set("Content-Type", "application/json")
                .send({
                    tasks: ["a", "b"]
                })
                .expect(400)
                .end(function(err, res) {
                    should.exist(res.body.message);
                    done(err);
                });
        });

        it("should return 415 for type which is not json", function(done) {
            request
                .post("/webapps")
                .set("Content-Type", "application/x-www-form-urlencoded")
                .send({
                    name: "test",
                    path: "test",
                    tasks: ["a", "b"]
                })
                .expect(415)
                .end(function(err, res) {
                    should.exist(res.body.message);
                    done(err);
                });
        });
    });

    describe("put", function() {
        it("should return 405", function(done) {
            request
                .put("/webapps")
                .set("Content-Type", "application/json")
                .send()
                .expect(405,done);
        });
    });

    describe("delete", function() {
        it("should return 405", function(done) {
            request
                .delete("/webapps")
                .set("Content-Type", "application/json")
                .send()
                .expect(405,done);
        });
    });
});

describe("/webapps/:app", function() {

    describe("get", function() {
        before(function(done) {
            ModelApp.remove(done);
        });
        it("should return 404 when app doesn\"t exist");
        it("should return the app");   
    });

    describe("put", function() {
        before(function(done) {
            ModelApp.remove(done);
        });
        it("should return 404 when app doesn\"t exist");
        it("should return the updated app by updating the app in DB");
        it("should return 400 with error msg for invalid request");
        it("should return 400 with error msg for invalid type");
    });

    describe("delete", function() {
        before(function(done) {
            ModelApp.remove(done);
        });
        it("should return 404 when app doesn\"t exist");
        it("should return 204 and remove it from db");
    });

    describe("post", function() {
        before(function(done) {
            ModelApp.remove(done);
        });
        it("should return 404 when app doesn\"t exist");
        it("should return 405 when app exist");
    });
});