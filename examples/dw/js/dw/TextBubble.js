function TextBubble(game) {
   var scale = game._scale;
   var margin = TextBubble.MARGIN*scale;
   var width = game.getWidth() - 2*margin;
   var height = TextBubble.HEIGHT * scale;
   Bubble.call(this, null, margin, game.getHeight()-margin-height,
         width, height);
}

TextBubble.MARGIN = 5;
TextBubble.HEIGHT = 200;

TextBubble.prototype = Object.create(Bubble.prototype, {
   
   paintContent: {
      value: function(ctx, y) {
         
         var x = TextBubble.MARGIN * game._scale * 2;
         
         ctx.fillStyle = 'rgb(255,255,255)';
         if (this._text) {
            game.drawString(this._text, x, y);
         }
         
      }
   },
   
   setText: {
      value: function(text) {
         this._text = text;
      }
   }
   
});

TextBubble.prototype.constructor = TextBubble;
