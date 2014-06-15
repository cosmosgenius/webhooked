/*jslint node: true */
/*jshint expr: true*/
/*global describe, it */
'use strict';

var request = require('supertest'),
    app     = require('../../app'),
    should  = require('should');

describe('App', function() {
    it('should exist', function(){
        should.exist(app);
    });
});

describe('Webapps', function() {
    it('should return 200', function(done){
        request(app)
            .get('/webapps')
            .expect(200,done);
    });
});