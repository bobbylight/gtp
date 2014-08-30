var gtp = gtp || {};

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
   
   drawSprite: function(ctx, x, y, row, col) {
      'use strict';
      var cellW = this.cellW;
      var cellH = this.cellH;
      var srcX = (cellW + this.spacing) * col;//(col-1);
      var srcY = (cellH + this.spacing) * row;//(row-1);
      //ctx.drawImage(this.gtpImage.canvas, srcX,srcY,cellW,cellH, x,y,cellW,cellH);
      this.gtpImage.drawScaled2(ctx, srcX,srcY,cellW,cellH, x,y,cellW,cellH);
   },
   
   drawByIndex: function(ctx, x, y, index) {
      'use strict';
      var row = Math.floor(index / this.colCount);
      var col = Math.floor(index % this.colCount);
      this.drawSprite(ctx, x, y, row, col);
   }

};
