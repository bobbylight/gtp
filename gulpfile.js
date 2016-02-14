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
   var typedoc = require('gulp-typedoc');
   var jshint = require('gulp-jshint');
   var stylish = require('jshint-stylish');
   var tsc = require('gulp-typescript');
   var tsconfig = tsc.createProject('tsconfig.json');
   var sourcemaps = require('gulp-sourcemaps');
   var tslint = require('gulp-tslint');
   var KarmaServer = require('karma').Server;
   var coveralls = require('gulp-coveralls');

   gulp.task('clean', function() {
      return del([
         './dist',
         './dist-all',
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
      runSequence('tslint', 'clean', 'compile', 'compile-concat', 'demo-usemin',
                'demo-cssmin', 'demo-copy-extra-files');
   });

   gulp.task('tslint', function() {
    return gulp.src([ 'src/**/*.ts' ])
        .pipe(tslint())
        .pipe(tslint.report('prose'));
   });
   gulp.task('compile', function() {
     var tsResult = gulp.src([ 'src/**/*.ts' ])
         .pipe(sourcemaps.init())
         .pipe(tsc(tsconfig));
     tsResult.dts.pipe(gulp.dest('dist/'));
     return tsResult.js
         .pipe(sourcemaps.write('.'))
         .pipe(gulp.dest('dist/'));
   });
   gulp.task('compile-concat', function() {
     var tsconfigConcatenated = {
         target: tsconfig.target || 'es5',
         declaration: true,
         outFile: 'gtp-all.js'
     };
     var tsResult = gulp.src([ 'src/**/*.ts' ])
         .pipe(sourcemaps.init())
         .pipe(tsc(tsconfigConcatenated));
     tsResult.dts.pipe(gulp.dest('dist-all/'));
     return tsResult.js
         .pipe(sourcemaps.write('.'))
         .pipe(gulp.dest('dist-all/'));
   });

   gulp.task('typedoc', function() {
      return gulp.src([ 'dist-all/gtp-all.d.ts' ])
         .pipe(typedoc({
            target: 'es5',
            includeDeclarations: true,
            mode: 'file',
            out: 'doc/',
            name: 'gtp',
            ignoreCompilerErrors: false,
            version: true
         }));
   });

   // Our demo game is pure JS, so it still uses jshint
   gulp.task('jshint', function() {
      return gulp.src([ 'example/rpg/src/js/**/*.js' ])
         .pipe(jshint())
         .pipe(jshint.reporter(stylish))
         .pipe(jshint.reporter('fail'));
   });

   // Lints and builds the library and demo source when changes occur.
   gulp.task('watch', [ 'tslint', 'compile', 'compile-concat', 'jshint' ], function() {
      // NOTE: typedoc does not seem to work in a watch - only runs the first
      // time; subsequent times it fails to generate sub-pages.
      gulp.watch('src/**/*.ts', [ 'tslint', 'compile', 'compile-concat' ]);
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
      runSequence('tslint', 'clean', 'compile', 'compile-concat', 'test',
            'typedoc', 'demo-usemin', 'demo-cssmin', 'demo-copy-extra-files');
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
      runSequence('tslint', 'jshint',
                  'clean', 'compile', 'compile-concat', 'test', 'typedoc',
                  'demo-usemin', 'demo-cssmin', 'demo-copy-extra-files',
                  'upload-coverage-data');
   });

})();
