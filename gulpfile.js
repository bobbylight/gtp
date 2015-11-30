// TODO: jsdoc generation?  Or alternatives???
(function() {
   'use strict';
   
   var gulp = require('gulp');
   var debug = require('gulp-debug');
   var del = require('del');
   var runSequence = require('run-sequence');
   var usemin = require('gulp-usemin');
   var uglify = require('gulp-uglify');
   var jsonMinify = require('gulp-jsonminify');
   //var minifyHtml = require('gulp-minify-html');
   var concatCss = require('gulp-concat-css');
   var cssmin = require('gulp-cssmin');
   var rev = require('gulp-rev');
   var jshint = require('gulp-jshint');
   var stylish = require('jshint-stylish');
   var KarmaServer = require('karma').Server;
   var coveralls = require('gulp-coveralls');
   
   gulp.task('clean', function() {
      return del([
         './dist',
         './example/rpg/dist',
         './coverage'
      ]);
   });
   
   // Tasks to build a minified version of the demo (run "gulp demo-build")
   gulp.task('demo-usemin', function() {
      return gulp.src([ 'example/rpg/src/index.html' ])
         .pipe(debug({ title: 'File going through usemin: ' }))
         .pipe(usemin({
            css: [ rev ],
            js: [ uglify, rev ],
            inlinejs: [ uglify ]
            //, html: [ minifyHtml({ empty: true }) ]
         }))
         .pipe(gulp.dest('example/rpg/dist/'));
   });
   gulp.task('demo-cssmin', function() {
      gulp.src('example/rpg/src/css/all.css')
         .pipe(concatCss('all.css'))
         .pipe(cssmin())
         .pipe(gulp.dest('example/rpg/dist/css/'));
   });
   gulp.task('demo-copy-extra-files', function() {
      gulp.src('example/rpg/src/maps/*.json')
         .pipe(jsonMinify())
         .pipe(gulp.dest('example/rpg/dist/maps/'));
      
      gulp.src('example/rpg/src/res/*')
         .pipe(gulp.dest('example/rpg/dist/res/'));
   });
   gulp.task('demo-build', function() {
      runSequence('jshint', 'clean', 'demo-usemin', 'demo-cssmin', 'demo-copy-extra-files');
   });
   
   gulp.task('jshint', function() {
      return gulp.src([ 'src/**/*.js', 'example/rpg/src/js/**/*.js' ])
         .pipe(jshint())
         .pipe(jshint.reporter(stylish))
         .pipe(jshint.reporter('fail'));
   });
   
   gulp.task('watch-js', function() {
      gulp.watch('src/**/*.js', [ 'jshint' ]);
      gulp.watch('example/rpg/src/js/**/*.js', [ 'jshint' ]);
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
      // We build the minified demo game too, just so Travis CI does it as well
      runSequence('jshint', 'clean', 'test', 'demo-usemin', 'demo-cssmin', 'demo-copy-extra-files');
   });
   
   gulp.task('upload-coverage-data', function() {
      gulp.src('coverage/**/lcov.info')
          .pipe(coveralls());
   });
   
   gulp.task('ci-build', function() {
      runSequence('default', 'upload-coverage-data');
   });
   
})();
