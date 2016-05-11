'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const colors = require('colors');
const nodemon = require('gulp-nodemon');

chalk.enabled = true;
colors.enabled = true;

gulp.task('server', () => {
    nodemon({
        script: 'index.js',
        verbose: true,
        watch: ['server/', '.env'],
        ext: 'js env json',
        // execMap: {
        //     'js': 'node-debug'
        // },
        env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('default', ['server']);
gulp.task('test', []);
