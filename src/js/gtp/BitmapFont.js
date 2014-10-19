var gtp = gtp || {};

gtp.BitmapFont = function(canvas, cellW, cellH, spacing) {
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
