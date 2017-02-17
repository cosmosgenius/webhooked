const gulp = require('gulp');
const chalk = require('chalk');
const colors = require('colors');
const nodemon = require('gulp-nodemon');

chalk.enabled = true;
colors.enabled = true;

const PORT = 9000;
const testdb = './testdb';

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
