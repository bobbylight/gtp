var gtp = gtp || {};

/**
 * Creates a font.
 * 
 * @param {gtp.Image} gtpImage A GTP image that is the source for the font.
 * @param {int} cellW The width of a cell in the font.
 * @param {int} cellH The height of a cell in the font.
 * @param {int} [spacing=1] Optional empty space between cells.
 * @param {int} [spacingY=spacing] Optional vertical empty space between cells.
 *        Specify only if different than the horizontal spacing.
 * @constructor
 */
gtp.BitmapFont = function(gtpImage, cellW, cellH, spacing, spacingY) {
   'use strict';
   gtp.SpriteSheet.apply(this, arguments);
};

gtp.BitmapFont.prototype = Object.create(gtp.SpriteSheet.prototype, {
   
   drawString: {
      value: function(str, x, y) {
         'use strict';
         
         var glyphCount = this.size;
         var ctx = game.canvas.getContext('2d');
         var charWidth = this.cellW;
         
         for (var i=0; i<str.length; i++) {
            var ch = str.charCodeAt(i) - 0x20;
            if (ch<0 || ch>=glyphCount) {
               ch = 0;
            }
            this.drawByIndex(ctx, x,y, ch);
            x += charWidth;
         }
      
      }
   }
   
});

gtp.BitmapFont.prototype.constructor = gtp.BitmapFont;
