/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before*/
'use strict';

var App     = require('../../app/models/app'),
    should  = require('should');

describe('App', function() {
    before(function(){

    });
    
    it('should exist', function(done) {
        should.exist(App);
        App.sync({ force: true }).done(done);
    });
});