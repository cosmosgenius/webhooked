'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const colors = require('colors');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const istanbul = require('gulp-istanbul');

chalk.enabled = true;
colors.enabled = true;

const PORT=9000;

gulp.task('instrument', () => {
    return gulp.src(['server/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('mocha', ['instrument'] ,() => {
    return gulp.src(['test/**/*.js'])
    .pipe(mocha({
        bail: true
    }))
    .pipe(istanbul.writeReports());
    // .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

gulp.task('watch', () => {
    return nodemon({
        script: 'index.js',
        verbose: true,
        watch: ['server/', '.env'],
        ext: 'js env json',
        env: { 'NODE_ENV': 'development', 'PORT': PORT }
    });
});

gulp.task('default', ['watch']);
gulp.task('test', ['mocha']);
