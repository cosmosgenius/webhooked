/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var request = require('supertest'),
    should  = require('chai').should(),
    app     = require('../app');

describe('App', function() {
    it('app should exist', function(){
        should.exist(app);
    });
});

describe('Webapps', function() {
    it('Webapps should return 200', function(done){
        request(app)
            .get('/webapps')
            .expect(200,done);
    });
});