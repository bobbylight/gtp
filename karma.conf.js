module.exports = function(config) {
  'use strict';

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'jasmine-ajax', 'jasmine', 'commonjs' ],


    // list of files / patterns to load in the browser.
    // See also:  http://karma-runner.github.io/0.13/config/files.html
    files: [
        'lib/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // Plugins need to be explicitly specified for tests to run in actual
    // browsers
    plugins: [ 'karma-jasmine', 'karma-jasmine-ajax', 'karma-commonjs', 'karma-coverage',
               'karma-phantomjs-launcher', 'karma-chrome-launcher',
               'karma-firefox-launcher', 'karma-spec-reporter'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'lib/index.js': [ 'coverage', 'commonjs' ],
      // Tests only get the commonjs preprocessor, source files get coverage too
      'lib/gtp/!(*.spec).js': [ 'coverage', 'commonjs' ],
      'lib/tiled/!(*.spec).js': [ 'coverage', 'commonjs' ],
      'lib/gtp/*.spec.js': [ 'commonjs' ],
      'lib/tiled/*.spec.js': [ 'commonjs' ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'progress', 'coverage' ],//, 'spec' ],

    coverageReporter: {
        instrumenterOptions: {
            istanbul: { noCompact: true }
        },
        dir: 'coverage',
        subdir: function(browserName) {
            // Standardize the output directory name for Phantom for coverage reports
            if (browserName.match(/Phantom/)) {
                return 'phantom';
            }
            return browserName;
        },
        type: 'lcov' // Generates lcov and HTML
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: [ 'Chrome', 'Firefox', 'IE', 'PhantomJS' ],
    // By default we only test on PhantomJS for CI builds
    browsers: [ 'PhantomJS' ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
