/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before*/
'use strict';

var App     = require('../../app/models/app'),
    should  = require('should');

describe('App', function() {
    describe('Object', function() {
        before(function(done) {
            App.sync({
                force: true
            }).done(done);
        });

        it('should exist', function() {
            should.exist(App);
        });
    });
});