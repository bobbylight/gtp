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
First, check out the project and install all dependencies:

```bash
git clone https://github.com/bobbylight/gtp.git
cd gtp
npm install
```

The TypeScript code lives in `src/`, and is transpiled into `lib/` by running `npm`.  Useful commands:

```bash
npm run clean   # deletes the build, doc, and coverage directories
npm run build   # build
npm run watch   # builds and watches for changes
npm run test    # runs unit tests and generates coverage report
npm run doc     # generates documentation
```

See `package.json` for all available commands.
