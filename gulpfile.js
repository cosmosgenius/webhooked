const gulp = require('gulp');
const chalk = require('chalk');
const colors = require("colors")
const nodemon = require('gulp-nodemon');

chalk.enabled = true
colors.enabled = true

gulp.task('server', () => {
    nodemon({
        script: 'index.js',
        ext: 'js env',
        env: { 'NODE_ENV': 'development' }
    })
})

gulp.task('default', ['server']);
gulp.task('test', []);
