/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before*/
'use strict';

var Project     = require('../../app/models/project'),
    should      = require('should');

describe('Project', function() {
    before(function(){

    });
    
    it('should exist', function(done) {
        should.exist(Project);
        Project.sync({ force: true }).done(done);
    });
});