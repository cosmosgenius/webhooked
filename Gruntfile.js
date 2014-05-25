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
        vows: {
            all: {
                options: {
                    reporter: 'spec',
                    verbose: false,
                    silent: false,
                    colors: true,
                    isolate: false,
                    coverage: 'json'
                },
                src: ['test/*.js']
            }
        },
        watch: {
            express: {
                files: ['**/*.js'],
                tasks: ['express:dev'],
                options: {
                    nospawn: true //Without this option specified express won't be reloaded
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-vows');


    // Default task.
    grunt.registerTask('default', ['express:dev', 'watch']);
    grunt.registerTask('test', ['express:test', 'vows', 'express:test:stop']);
};