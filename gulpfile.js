'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const colors = require('colors');
const history = require('connect-history-api-fallback');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const proxyMiddleware = require('http-proxy-middleware');

chalk.enabled = true;
colors.enabled = true;

const PORT=3000;
const SERVERPORT=PORT+2;
const server_url = `http://localhost:${SERVERPORT}`;
const paths = {
    dev: '.dev'
};

gulp.task('server', () => {
    return nodemon({
        script: 'index.js',
        verbose: true,
        watch: ['server/', '.env'],
        ext: 'js env json',
        execMap: {
            'js': `PORT=${SERVERPORT} node`
        },
        env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('watch', ['server'], () => {
    const proxy = proxyMiddleware('/api', {target: server_url});
    const spa = history({
        index: '/index.html',
        verbose: true
    });
    browserSync.init({
        browser: ['chrome'],
        server: paths.dev,
        // files: [paths.dev + '/static/css/**/*.css'],
        middleware: [proxy, spa],
        open: false
    });
    // gulp.watch(paths.sass, ['css']);
    // gulp.watch(paths.scss, ['scss']);
    // gulp.watch(paths.modules, ['modules-reload']);
    // gulp.watch(paths.components, ['components-reload']);
    // gulp.watch(paths.templates, ['templates-reload']);
    // gulp.watch(paths.index, ['indexhtml']);
    // gulp.watch(paths.embed, ['embedhtml']);
});

gulp.task('default', ['server']);
gulp.task('test', []);
