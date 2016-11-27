# GTP - A very basic 2D HTML5 game library
[![Build Status](https://travis-ci.org/bobbylight/gtp.svg?branch=master)](https://travis-ci.org/bobbylight/gtp)
[![Coverage Status](https://coveralls.io/repos/bobbylight/gtp/badge.svg?branch=master&service=github)](https://coveralls.io/github/bobbylight/gtp?branch=master)

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

The TypeScript code lives in `src/`, and is transpiled into `dist/`.  A single
file containing all transpiled content is also created in `dist-all/`.  An
example game (itself a WIP also) lives in `example/`.  Both the library and the
example game can be built via running gulp:

```bash
gulp
```

Tasks are also provided for individually running unit tests, linting, etc.

## To-Do
Unit tests are temporarily disabled as they stopped working when I converted this project
to commonjs, and I'm having a tough time convincing Karma to run them in this state.
