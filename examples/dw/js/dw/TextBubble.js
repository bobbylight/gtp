function TextBubble(game) {
   'use strict';
   var scale = game._scale;
   var margin = TextBubble.MARGIN*scale;
   var width = game.getWidth() - 2*margin;
   var height = TextBubble.HEIGHT * scale;
   Bubble.call(this, null, margin, game.getHeight()-margin-height,
         width, height);
}

TextBubble.MARGIN = 5;
TextBubble.HEIGHT = 100;

TextBubble.prototype = Object.create(Bubble.prototype, {
   
   /**
    * Returns whether the user is "done" talking; that is, whether the entire
    * conversation has been rendered (including multiple pages, if necessary).
    */
   handleInput: {
      value: function() {
         'use strict';
         var im = game.inputManager;
         if (im.isKeyDown(gtp.Keys.X, true) || im.isKeyDown(gtp.Keys.Z, true)) {
            return true;
         }
         return false;
      }
   },
   
   paintContent: {
      value: function(ctx, y) {
         'use strict';
         
         var x = TextBubble.MARGIN * game._scale * 2;
         
         ctx.fillStyle = 'rgb(255,255,255)';
         if (this._text) {
            game.drawString(this._text, x, y);
         }
         
      }
   },
   
   setText: {
      value: function(text) {
         'use strict';
         this._text = text;
      }
   }
   
});

TextBubble.prototype.constructor = TextBubble;
