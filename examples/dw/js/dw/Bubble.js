function Bubble(title, x, y, w, h) {
   'use strict';
   this.title = title;
   var scale = 1;//game._scale;
   this.x = x * scale;
   this.y = y * scale;
   this.w = w * scale;
   this.h = h * scale;
   
//      int strokeW = 2 * SCALE;
//      borderStroke = new BasicStroke(strokeW, BasicStroke.CAP_ROUND,
//                              BasicStroke.JOIN_ROUND);
}

Bubble.FONT_WIDTH = 16; // 8 * SCALE; TODO

Bubble.prototype = {
   
   _breakApart: function(text, w) {
      'use strict';
      
      var lines = [];
      
      // Newlines are automatic line breaks
      var lineList1 = text.split('\n');
      
      for (var i=0; i<lineList1.length; i++) {
         this._breakApartLine(lineList1[i], w, lines);
      }
      
      return lines;
   },
   
   _breakApartLine: function(line, w, lines) {
      'use strict';
      
      var optimal = Math.floor(w / Bubble.FONT_WIDTH);
      
      while (line.length > optimal) {
         
         var offs = optimal - 1;
         var ch = line.charAt(offs);
         while (ch!==' ') {
            ch = line.charAt(--offs);
         }
         lines.push(line.substring(0, offs));
         
         line = line.substring(offs).trim();
      }
      
      //if (line.length>0) {
         lines.push(line);
      //}
   },
   
   paint: function(ctx) {
      'use strict';
      
      var scale = game._scale;
      var fontHeight = game.stringHeight();
      
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fillRect(this.x,this.y, this.w,this.h);
      
      // TODO: border via graphics
      ctx.strokeStyle = 'rgb(255,255,255)';
      ctx.lineWidth = 2;
      var doubleScale = 2 * scale;
      ctx.strokeRect(this.x+doubleScale, this.y+doubleScale, this.w-2*doubleScale, this.h-2*doubleScale);
      
      if (this.title) {
         ctx.fillStyle = 'rgb(0,0,0)';
         var stringW = game.stringWidth(this.title);
         stringW += 4 * scale;
         var x = this.x + Math.floor((this.w-stringW)/2);
         ctx.fillRect(x, this.y, stringW, fontHeight);
         
         ctx.fillStyle = 'rgb(255,255,255)';
         game.drawString(this.title, x+2*scale, this.y);
      }
      
      this.paintContent(ctx, this.y+fontHeight+this.getXMargin());
   },
   
   getXMargin: function() {
      'use strict';
      return 8 * game._scale;
   },
   
   getYMargin: function() {
      'use strict';
      return 8 * game._scale;
   },
   
   paintContent: function(ctx, y) {
      // Should be overridden
   }

};
