var gtp = gtp || {};

gtp.SpriteSheet = function(canvas, cellW, cellH, spacing) {
   this.canvas = canvas;
   this.cellW = cellW;
   this.cellH = cellH;
   this.spacing = spacing || 1;
   
   this.rowCount = Math.floor(canvas.height / (cellH + spacing));
   if ((canvas.height - this.rowCount*(cellH+spacing)) >= cellH) {
      this.rowCount++;
   }
   this.colCount = Math.floor(canvas.width / (cellW + spacing));
   if ((canvas.width - this.colCount*(cellW+spacing)) >= cellW) {
      this.colCount++;
   }
   
   this.size = this.rowCount * this.colCount;
};

gtp.SpriteSheet.prototype = {
   
   draw: function(ctx, x, y, row, col) {
      var cellW = this.cellW;
      var cellH = this.cellH;
      var srcX = (cellW + this.spacing) * col;//(col-1);
      var srcY = (cellH + this.spacing) * row;//(row-1);
      ctx.drawImage(this.canvas, srcX,srcY,cellW,cellH, x,y,cellW,cellH);
   },
   
   drawByIndex: function(ctx, x, y, index) {
      var row = Math.floor(index / this.colCount);
      var col = Math.floor(index % this.colCount);
      this.draw(ctx, x, y, row, col);
   }

};
