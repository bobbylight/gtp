(function() {
   'use strict';

   var gulp = require('gulp');
   var debug = require('gulp-debug');
   var del = require('del');
   var runSequence = require('run-sequence');
   var typedoc = require('gulp-typedoc');
   var tsc = require('gulp-typescript');
   var tsProject = tsc.createProject('tsconfig.json');
   var merge = require('merge2');
   var sourcemaps = require('gulp-sourcemaps');
   var tslint = require('gulp-tslint');
   var KarmaServer = require('karma').Server;
   var coveralls = require('gulp-coveralls');

   gulp.task('clean', function() {
      return del([
         './lib',
         './coverage',
          './doc'
      ]);
   });

   gulp.task('tslint', function() {
    return tsProject.src()//gulp.src([ 'src/**/*.ts' ])
        .pipe(tslint({ formatter: 'prose' }))
        .pipe(tslint.report());
   });
   gulp.task('compile', function() {
     var tsResult = tsProject.src()
         .pipe(sourcemaps.init())
         .pipe(tsProject());
     return merge([
        tsResult.dts.pipe(gulp.dest('lib/')),
        tsResult.js
         .pipe(sourcemaps.write('.'))
         .pipe(gulp.dest('lib/'))
     ]);
   });

   gulp.task('typedoc', function() {
      return gulp.src([ 'src/**/*.ts', '!src/**/*.spec.ts' ])
         .pipe(typedoc({
            target: 'es5',
            includeDeclarations: true,
            mode: 'modules',
            module: 'commonjs',
            out: 'doc/',
            name: 'gtp',
            ignoreCompilerErrors: false,
            version: true
         }));
   });

   // Lints and builds the library source when changes occur.
   gulp.task('watch', [ 'tslint', 'compile' ], function() {
      // NOTE: typedoc does not seem to work in a watch - only runs the first
      // time; subsequent times it fails to generate sub-pages.
      gulp.watch('src/**/*.ts', [ 'tslint', 'compile' ]);
   });

   gulp.task('test', function(done) {
      new KarmaServer({
         configFile: __dirname + '/karma.conf.js',
         singleRun: true
      }, done).start();
   });

   // By default we only test on PhantomJS for CI builds
   gulp.task('test-all-browsers', function(done) {
      new KarmaServer({
         configFile: __dirname + '/karma.conf.js',
         singleRun: true,
         browsers: [ 'Chrome', 'Firefox', 'PhantomJS' ]
      }, done).start();
   });

   gulp.task('watch-test', function(done) {
      new KarmaServer({
         configFile: __dirname + '/karma.conf.js',
         singleRun: false,
         browsers: [ 'PhantomJS' ]
      }, done).start();
   });

   gulp.task('default', function() {
      runSequence('tslint', 'clean', 'compile', 'test', 'typedoc');
   });

   gulp.task('upload-coverage-data', function() {
      gulp.src('coverage/**/lcov.info')
          .pipe(coveralls());
   });

   gulp.task('ci-build', function() {
      // runSequence does not appear to work when calling another task that
      // has a runSequence in it!  It will run the second task after the
      // first task in the "child" runSequence
      //runSequence('default', 'upload-coverage-data');
      runSequence('tslint', 'clean', 'compile', 'test', 'typedoc', 'upload-coverage-data');
   });

})();
