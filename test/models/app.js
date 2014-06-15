/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before, after*/
'use strict';

var should = require('should'),
    db = require('../../app/models'),
    App = db.App;

describe('App', function() {
    before(function(done) {
        App.remove(done);
    });

    it('should exist', function() {
        should.exist(App);
    });

    it('should save without error', function(done){
        var app = new App({
            name : 'test',
            path : 'test',
            tasks : ['a','b']
        });

        app.save(function(err,app){
            app.name.should.be.equal('test');
            app.path.should.be.equal('test');
            app.tasks.toObject().should.eql(['a','b']);
            done(err);
        });
    });

    it('should throw error when name is less than 2 character', function(done){
        var app = new App({
            name : 't',
            path : 'test',
            tasks : ['a','b']
        });

        app.save(function(err,app){
            should.exist(err);
            should.exist(err.errors.name);
            should.not.exist(err.errors.path);
            should.not.exist(app);
            done();
        });
    });

    it('should throw error when path is less than 2 character', function(done){
        var app = new App({
            name : 'ts',
            path : '',
            tasks : ['a','b']
        });

        app.save(function(err,app){
            should.exist(err);
            should.exist(err.errors.path);
            should.not.exist(err.errors.name);
            should.not.exist(app);
            done();
        });
    });

    it('should throw error when path and name is less than 2 character', function(done){
        var app = new App({
            name : 't',
            path : '',
            tasks : ['a','b']
        });

        app.save(function(err,app){
            should.exist(err);
            should.exist(err.errors.path);
            should.exist(err.errors.name);
            should.not.exist(app);
            done();
        });
    });

    it('should throw error for duplicated name', function(done){
        var app = new App({
            name : 'sd',
            path : 's',
            tasks : ['a','b']
        });

        var app1 = new App({
            name : 'sd',
            path : 's',
            tasks : ['a','b']
        });

        app.save(function(err,app){
            should.not.exist(err);
            should.exist(app);
            app1.save(function(err1,app1){
                should.not.exist(app1);
                should.exist(err1);
                err1.code.should.be.equal(11000);
                done();
            });
        });
    });

    after(function(done) {
        App.remove(done);
    });
});