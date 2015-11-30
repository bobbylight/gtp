// Karma configuration
// Generated on Mon Jul 27 2015 22:55:22 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  'use strict';
  
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser.
    // Note that this is also the order stuff is loaded in, so we cannot just
    // wildcard all JS files in a folder, due to dependencies (!)
    // See also:  http://karma-runner.github.io/0.13/config/files.html
    files: [
      'src/gtp/AssetType.js',
      'src/gtp/AssetLoader.js',
      'src/gtp/BrowserUtil.js',
      'src/gtp/Utils.js',
      'src/gtp/Delay.js',
      'src/gtp/Rectangle.js',
      'src/gtp/SpriteSheet.js',
      'src/gtp/BitmapFont.js',
      'src/gtp/State.js',
      'src/gtp/FadeOutInState.js',
      'src/gtp/Image.js',
      'src/gtp/ImageAtlas.js',
      'src/gtp/ImageUtils.js',
      'src/gtp/Keys.js',
      'src/gtp/InputManager.js',
      //'src/gtp/Sound.js',
      'src/gtp/Timer.js',
      'src/tiled/*.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    
    // Plugins need to be explicitly specified for tests to run in actual
    // browsers
    plugins: [ 'karma-jasmine', 'karma-coverage',
               'karma-phantomjs-launcher', 'karma-chrome-launcher',
               'karma-firefox-launcher'
    ],
    
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/gtp/*.js': 'coverage',
      'src/tiled/*.js': 'coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
//    reporters: [ 'progress', 'coverage' ],
    reporters: [ 'dots', 'coverage' ],

    coverageReporter: {
        instrumenterOptions: {
            istanbul: { noCompact: true }
        },
        type: 'lcov' // Generates lcov and HTML (lcov for coveralls.io)
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
}
