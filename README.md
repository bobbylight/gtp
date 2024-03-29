# GTP - A very basic 2D HTML5 game library
![Build](https://github.com/bobbylight/gtp/actions/workflows/node.js.yml/badge.svg)
![CodeQL](https://github.com/bobbylight/gtp/actions/workflows/codeql-analysis.yml/badge.svg)
[![codecov](https://codecov.io/gh/bobbylight/gtp/branch/master/graph/badge.svg?token=)](https://codecov.io/gh/bobbylight/gtp)

This is a basic game library for 2D HTML5 games, written in TypeScript.

Features include:

* Input
* Audio
* Asset management (async loading of graphics, sounds, resources)
* Game states
* [Tiled](http://www.mapeditor.org/) map support (supports 1.8.x JSON format)

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
npm run lint    # Lints the source code
npm run test    # runs unit tests and generates coverage report
npm run doc     # generates documentation
```

See `package.json` for all available commands.
