/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
var SCALE = 2;
var tileSize = 16 * SCALE;
//var game = null;
var CANVAS_WIDTH = tileSize*24; // TODO: No magic numbers for row/column sizes
var CANVAS_HEIGHT = tileSize*21;
var game;

function init(parent) {
   'use strict';
   game = new TestGame({ parent: parent, scale: SCALE, width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
   game.setState(new LoadingState());
   game.start();
}
