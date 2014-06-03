/*jslint node: true */
/*jshint expr: true*/
/*global describe, it, before*/
'use strict';

var sequelize   = require('../app/models'),
    should      = require('should');

describe('sequelize', function() {
    it('should exist', function() {
        should.exist(sequelize);
    });
});

describe('Project', function() {
    before(function(){

    });
    
    it('should exist', function() {
        should.exist(sequelize.models.Project);
    });
});