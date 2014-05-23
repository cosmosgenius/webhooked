/*jslint node: true */
'use strict';

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'index.js',
                    debug: true
                }
            },
            prod: {
                options: {
                    script: 'index.js',
                    node_env: 'production'
                }
            },
            test: {
                options: {
                    script: 'index.js',
                    node_env: 'test'
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    globals: ['should'],
                    timeout: 10000,
                    ignoreLeaks: false,
                    ui: 'bdd',
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            express: {
                files:  [ '**/*.js' ],
                tasks:  [ 'express:dev' ],
                options: {
                    nospawn: true //Without this option specified express won't be reloaded
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Default task.
    grunt.registerTask('default', ['express:dev', 'watch']);
    grunt.registerTask('test', ['express:test', 'mochaTest', 'express:test:stop']);
};
