# GTP - A very basic 2D HTML5 game library
[![Build Status](https://travis-ci.org/bobbylight/gtp.svg?branch=master)](https://travis-ci.org/bobbylight/gtp)
[![Coverage Status](https://coveralls.io/repos/bobbylight/gtp/badge.svg?branch=master&service=github)](https://coveralls.io/github/bobbylight/gtp?branch=master)
[![Dependency Status](https://img.shields.io/david/bobbylight/gtp.svg)](https://david-dm.org/bobbylight/gtp)
[![Dev Dependency Status](https://img.shields.io/david/dev/bobbylight/gtp.svg)](https://david-dm.org/bobbylight/gtp?type=dev)

This is a basic game library for 2D HTML5 games, written in TypeScript.

Features include:

* Input
* Audio
* Asset management (async loading of graphics, sounds, resources)
* Game states
* [Tiled](http://www.mapeditor.org/) map support

## Hacking
First, install `gulp` using `npm` if you do not already have it:

```bash
npm install -g gulp
```

Next, check out the project and install all dependencies:

```bash
git clone https://github.com/bobbylight/gtp.git
cd gtp
npm install
```

The TypeScript code lives in `src/`, and is transpiled into `lib/` by running gulp.  Useful commands:

```bash
gulp         # build
gulp watch   # builds and watches for changes
gulp test    # runs unit tests
gulp typedoc # generates documentation
```

Gulp tasks are also provided for individually running unit tests, linting, etc.
