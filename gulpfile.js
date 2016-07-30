const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const chalk = require('chalk');
const colors = require('colors');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const istanbul = require('gulp-istanbul');

chalk.enabled = true;
colors.enabled = true;

const PORT = 9000;
const testdb = './testdb';

gulp.task('instrument', () => {
    return gulp.src(['server/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('mocha', ['instrument'] ,() => {
    return gulp.src(['test/**/*.js'])
    .pipe(mocha({
        bail: true,
        require: ['should']
    }))
    .pipe(istanbul.writeReports());
    // .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

gulp.task('testenv', () => {
    return process.env.DB_PATH = testdb;
});

gulp.task('deltestdb', () => {
    del.sync(testdb);
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
gulp.task('test', (done) => {
    runSequence(
        'testenv',
        'mocha',
        'deltestdb',
        done
    );
});
