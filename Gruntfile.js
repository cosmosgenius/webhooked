"use strict";

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        env : {
            dev : {
                NODE_ENV : 'development',
            },
            test : {
                NODE_ENV : 'test'
            },
            prod : {
                NODE_ENV : 'production'
            }
        },
        express: {
            options: {
                script: "index.js"
            },
            dev: {
                options: {
                    debug: true
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    globals: ["should"],
                    timeout: 10000,
                    ignoreLeaks: false,
                    ui: "bdd",
                    reporter: "spec",
                    require: ["should", "coverage/blanket"]
                },
                src: ["test/**/*.js"]
            },
            "html-cov": {
                options: {
                    reporter: "html-cov",
                    quiet: true,
                    captureFile: "coverage.html"
                },
                src: ["test/**/*.js"]
            },
            "travis-cov": {
                options: {
                    reporter: "travis-cov"
                },
                src: ["test/**/*.js"]
            },
            "lcov": {
                options:  {
                    reporter: "mocha-lcov-reporter",
                    quiet: true,
                    captureFile: "lcov.info"
                },
                src: ["test/**/*.js"]
            }
        },
        watch: {
            express: {
                files: ["**/*.js","!**/node_modules/**"],
                tasks: ["express:dev"],
                options: {
                    nospawn: true //Without this option specified express won"t be reloaded
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-express-server");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks('grunt-env');

    // Default task.
    grunt.registerTask("default", ["env:dev","express:dev", "watch"]);
    grunt.registerTask("integration",["env:test"])
    grunt.registerTask("unit",["env:test","express", "mochaTest", "express:stop"])
    grunt.registerTask("test", ["unit","integration"]);

};