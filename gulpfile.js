'use strict';

// Require and load our packages
var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    jslint = require('gulp-jslint'),
    yuidoc = require('gulp-yuidoc'),
    jshint = require('gulp-jshint');

// Reference our app files for easy reference in out gulp tasks
var paths = {
    server : {
        specs : ['./test/lib/*.js'],
        libs_specs_path : ['./test/lib/*.js','./test/api/*.js']
    }
};

// The `default` task gets called when no task name is provided to Gulp
gulp.task('default', ['jslint', 'test', 'docs'], function (cb) {
    cb().pipe(process.exit());
});


gulp.task('test', function (cb) {
    gulp.src('lib/*.js')

        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files

        .on('finish', function () {
            gulp.src(paths.server.libs_specs_path)
                .pipe(mocha({reporter: 'spec', timeout: 5000}))
                .pipe(istanbul.writeReports()) // Creating the reports after test run
                .on('end', function () {
                    process.exit();
                });
        });
});
gulp.task('lint', function() {
    return gulp.src(['./index.js', 'lib/*.js', 'lib/outputs/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('jslint', function (cb) {
    gulp.src(['lib/helper/*.js', 'lib/*.js'])

        .pipe(jslint({
            // these directives can
            // be found in the official
            // JSLint documentation.
            node: true,
            nomen: true,
            plusplus: true,
            // you can also set global
            // declarations for all source
            // files like so:
            global: [],
            predef: [],
            // both ways will achieve the
            // same result; predef will be
            // given priority because it is
            // promoted by JSLint

            // pass in your prefered
            // reporter like so:
            reporter: 'default',
            // ^ there's no need to tell gulp-jslint
            // to use the default reporter. If there is
            // no reporter specified, gulp-jslint will use
            // its own.

            // specifiy custom jslint edition
            // by default, the latest edition will
            // be used
            edition: '2014-07-08',

            // specify whether or not
            // to show 'PASS' messages
            // for built-in reporter
            errorsOnly: false
        }))

        .on('finish', function () {
            cb().pipe(process.exit());
        });
});