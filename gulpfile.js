const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const typedoc = require('gulp-typedoc');
const tsc = require('gulp-typescript');
const tsProject = tsc.createProject('tsconfig.json');
const merge = require('merge2');
const sourcemaps = require('gulp-sourcemaps');
const gulpTslint = require('gulp-tslint');
const tslint = require('tslint');
const KarmaServer = require('karma').Server;
const coveralls = require('gulp-coveralls');

gulp.task('clean', () => {
    return del([
        './lib',
        './coverage',
        './doc'
    ]);
});

gulp.task('tslint', () => {
    const program = tslint.Linter.createProgram('./tsconfig.json');
    return tsProject.src()//gulp.src([ 'src/**/*.ts' ])
        .pipe(gulpTslint({ formatter: 'prose' , program: program }))
        .pipe(gulpTslint.report());
});
gulp.task('compile', () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return merge([
        tsResult.dts.pipe(gulp.dest('lib/')),
        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('lib/'))
    ]);
});

gulp.task('typedoc', () => {
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
gulp.task('watch', [ 'tslint', 'compile' ], () => {
    // NOTE: typedoc does not seem to work in a watch - only runs the first
    // time; subsequent times it fails to generate sub-pages.
    gulp.watch('src/**/*.ts', [ 'tslint', 'compile' ]);
});

gulp.task('test', (done) => {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

// By default we only test on PhantomJS for CI builds
gulp.task('test-all-browsers', (done) => {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        browsers: [ 'Chrome', 'Firefox', 'PhantomJS' ]
    }, done).start();
});

gulp.task('watch-test', (done) => {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false,
        browsers: [ 'PhantomJS' ]
    }, done).start();
});

gulp.task('default', () => {
    // typedoc temporarily disabled as 0.10.0 release throws an exception on this project when running
    runSequence('tslint', 'clean', 'compile', 'test'/*, 'typedoc'*/);
});

gulp.task('upload-coverage-data', () => {
    gulp.src('coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('ci-build', () => {
    // runSequence does not appear to work when calling another task that
    // has a runSequence in it!  It will run the second task after the
    // first task in the "child" runSequence
    //runSequence('default', 'upload-coverage-data');
    runSequence('tslint', 'clean', 'compile', 'test', /*'typedoc', */ 'upload-coverage-data');
});
