/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
var SCALE = 2;
var tileSize = 16 * SCALE;
var CANVAS_WIDTH = tileSize*17; // TODO: No magic numbers for row/column sizes
var CANVAS_HEIGHT = tileSize*15;
var game;

function init(parent) {
   'use strict';
   game = new DwGame({ parent: parent, scale: SCALE, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
         targetFps: 60 });
   game.setState(new LoadingState());
   game.start();
}
