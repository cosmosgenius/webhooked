/*global describe, it, before */
"use strict";

var request = require("supertest"),
    app = require("../app"),
    should = require("should"),
    db = require("../app/models"),
    ModelApp = db.App;

request = request(app);

describe.skip("deploy", function() {
    describe("app", function() {
        it("should exist", function() {
            should.exist(app);
        });
    });

    describe("get", function() {
        before(function(done) {
            ModelApp.remove(done);
        });

        it("should return 200 with empty array", function(done) {
            request
                .get("/deploy")
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
                    .get("/deploy")
                    .expect(200)
                    .end(function(err, res) {
                        res.body.should.be.an.instanceOf(Array);
                        res.body.should.have.length(1);
                        var app_res = res.body[0];
                        app_res._id.should.be.equal(app_1._id+"");
                        ModelApp.remove(done);
                    });
            });
        });
    });
});