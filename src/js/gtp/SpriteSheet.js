var gtp = gtp || {};

/**
 * Creates a sprite sheet.
 * 
 * @param {gtp.Image} gtpImage A GTP image that is the source for the sprite sheet.
 * @param {int} cellW The width of a cell in the sprite sheet.
 * @param {int} cellH The height of a cell in the sprite sheet.
 * @param {int} spacing Optional empty space between cells.  This defaults to
 *        <code>1</code> if not specified.
 * @constructor
 */
gtp.SpriteSheet = function(gtpImage, cellW, cellH, spacing) {
   'use strict';
   this.gtpImage = gtpImage;
   this.cellW = cellW;
   this.cellH = cellH;
   this.spacing = spacing || 1;
   
   this.rowCount = Math.floor(gtpImage.height / (cellH + spacing));
   if ((gtpImage.height - this.rowCount*(cellH+spacing)) >= cellH) {
      this.rowCount++;
   }
   this.colCount = Math.floor(gtpImage.width / (cellW + spacing));
   if ((gtpImage.width - this.colCount*(cellW+spacing)) >= cellW) {
      this.colCount++;
   }
   
   this.size = this.rowCount * this.colCount;
};

gtp.SpriteSheet.prototype = {
   
   /**
    * Draws a sprite in this sprite sheet by row and column.
    * @param {CanvasRenderingContext2D} ctx The canvas' context.
    * @param {int} x The x-coordinate at which to draw.
    * @param {int} y The y-coordinate at which to draw.
    * @param {int} row The row in the sprite sheet of the sprite to draw.
    * @param {int} col The column in the sprite sheet of the sprite to draw.
    */
   drawSprite: function(ctx, x, y, row, col) {
      'use strict';
      var cellW = this.cellW;
      var cellH = this.cellH;
      var srcX = (cellW + this.spacing) * col;//(col-1);
      var srcY = (cellH + this.spacing) * row;//(row-1);
      //ctx.drawImage(this.gtpImage.canvas, srcX,srcY,cellW,cellH, x,y,cellW,cellH);
      this.gtpImage.drawScaled2(ctx, srcX,srcY,cellW,cellH, x,y,cellW,cellH);
   },
   
   /**
    * Draws a sprite in this sprite sheet by index
    * (<code>row*colCount + col</code>).
    * @param {CanvasRenderingContext2D} ctx The canvas' context.
    * @param {int} x The x-coordinate at which to draw.
    * @param {int} y The y-coordinate at which to draw.
    * @param {int} index The index in the sprite sheet of the sprite to draw.
    */
   drawByIndex: function(ctx, x, y, index) {
      'use strict';
      var row = Math.floor(index / this.colCount);
      var col = Math.floor(index % this.colCount);
      this.drawSprite(ctx, x, y, row, col);
   }

};
