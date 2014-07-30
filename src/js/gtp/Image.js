/**
 * @namespace
 */
var gtp = gtp || {};

/**
 * A wrapper around images.  Handles browser-specific quirks and other things
 * a game shouldn't have to know about.
 *
 * @constructor
 */
gtp.Image = function(canvas) {
   this._canvas = canvas;
   this.width = this._canvas.width;
   this.height = this._canvas.height;
   this._ensure256Square();
};

gtp.Image.prototype = {
   
   /**
    * Chrome has trouble copying from a canvas in RAM to a canvas in GPU memory
    * and vice versa, unless all canvases are >= 256x256.
    */
   _ensure256Square: function() {
      if (this._canvas.width<256 || this._canvas.height<256) {
         var w = Math.max(256, this._canvas.width);
         var h = Math.max(256, this._canvas.height);
         var canvas2 = gtp.Utils.createCanvas(w, h);
         var ctx2 = canvas2.getContext('2d');
         ctx2.drawImage(this._canvas, 0,0);
         this._canvas = canvas2;
      }
   },
   
   /**
    * Draws this image.
    * 
    * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
    * @param {int} x The x-coordinate at which to draw.
    * @param {int} y The y-coordinate at which to draw.
    */
   draw: function(ctx, x, y) {
      ctx.drawImage(this._canvas, x, y);
   },
   
   /**
    * Draws this image.
    * 
    * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
    * @param {int} x The x-coordinate at which to draw.
    * @param {int} y The y-coordinate at which to draw.
    * @param {int} w The width to (possibly) stretch the image to when
    *              drawing.
    * @param {int} h The height to (possibly) stretch the image to when
    *              drawing.
    */
   drawScaled: function(ctx, x, y, w, h) {
      ctx.drawImage(this._canvas, x, y, w, h);
   },
   
   /**
    * Draws this image.
    * 
    * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
    * @param {int} srcX The x-coordinate at which to draw.
    * @param {int} srcY The y-coordinate at which to draw.
    * @param {int} srcW The width of the (possibly) sub-image to draw.
    * @param {int} srcH The height of the (possibly) sub-image to draw.
    * @param {int} destX The x-coordinate at which to draw.
    * @param {int} destY The y-coordinate at which to draw.
    * @param {int} destW The width to (possibly) stretch the image to when
    *              drawing.
    * @param {int} destH The height to (possibly) stretch the image to when
    *              drawing.
    */
   drawScaled2: function(ctx, srcX,srcY,srcW,srcH, destX,destY,destW,destH) {
      ctx.drawImage(this._canvas, srcX,srcY,srcW,srcH, destX,destY,destW,destH);
   }
   
   
};
