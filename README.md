GTP - A very basic 2D HTML5 game library
========================================
This is a basic game library for 2D HTML5 games.  It is a WIP, and probably
isn't very useful to most people.

Features include:

* Input
* Audio
* Asset management (async loading of graphics, sounds, resources)
* Game states
* [Tiled](http://www.mapeditor.org/) map support

## Hacking
First, install `gulp` using `npm` if you do not already have it:

    npm install -g gulp

Next, check out the project and install all dependencies:

    git clone https://github.com/bobbylight/gtp.git
    cd gtp
    npm install

The development version of the library lives in `src/`.  An example game (itself
a WIP) lives in `example/`.  Both the library and the example game can be built
via running gulp:

    gulp

Tasks are also provided for running unit tests, linting, etc.
