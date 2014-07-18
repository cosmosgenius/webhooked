/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before */
'use strict';

var request = require('supertest'),
    app = require('../../app'),
    should = require('should'),
    db = require('../../app/models'),
    ModelApp = db.App;

describe('Webapps', function() {
    describe('app', function() {
        it('should exist', function() {
            should.exist(app);
        });
    });

    describe('get', function() {
        before(function(done) {
            ModelApp.remove(done);
        });

        it('should return 200 and should be empty', function(done) {
            request(app)
                .get('/webapps')
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.instanceOf(Array);
                    res.body.should.have.length(0);
                    done(err);
                });
        });

        it('should return 200 with 1 object', function(done) {
            var app1 = new ModelApp({
                name: 'test',
                path: 'test',
                tasks: ['a', 'b']
            });

            app1.save(function(err, app_1) {
                if (err) {
                    done(err);
                }
                request(app)
                    .get('/deploy')
                    .expect(200)
                    .end(function(err, res) {
                        res.body.should.be.an.instanceOf(Array);
                        res.body.should.have.length(1);
                        var app_res = res.body[0];
                        app_res._id.should.be.equal(app_1._id + '');
                        ModelApp.remove(done);
                    });
            });
        });
    });

    describe('post', function() {
        before(function(done) {
            ModelApp.remove(done);
        });

        it('should return 201 and should add the to db', function(done) {
            request(app)
                .get('/webapps')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        done(err);
                        return;
                    }
                    res.body.should.be.an.instanceOf(Array);
                    res.body.should.have.length(0);
                    request(app)
                        .post('/webapps')
                        .send({
                            name: 'test',
                            path: 'test',
                            tasks: ['a', 'b']
                        })
                        .expect(201)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            var postres = res.body;
                            request(app)
                                .get('/webapps')
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
    });
});