function QuestionBubble(game, choices) {
   'use strict';
   var scale = game._scale;
   var margin = Bubble.MARGIN*scale;
   var x = 200 * scale;
   var y = 20 * scale;
   var width = game.getWidth() - 2*margin;
   var height = TextBubble.HEIGHT * scale;
   Bubble.call(this, null, x, y, width, height);
   
   this._choices = choices;
   this._curChoice = 0;
}

QuestionBubble.prototype = Object.create(Bubble.prototype, {
   
   /**
    * Returns whether the user is "done" talking; that is, whether the entire
    * conversation has been rendered (including multiple pages, if necessary).
    */
   handleInput: {
      value: function() {
         'use strict';
         var im = game.inputManager;
         if (im.isKeyDown(gtp.Keys.X, true)) {
            this._curChoice = 0;
         }
         else if (im.isKeyDown(gtp.Keys.Z, true)) {
            this._done = true;
            return true;
         }
         return false;
      }
   },
   
   update: {
      value: function(delta) {
         'use strict';
         
         var im = game.inputManager;
         
         if (im.isKeyDown(gtp.Keys.UP_ARROW, true)) {
            this._curChoice = Math.max(0, this._curChoice-1);
         }
         else if (im.isKeyDown(gtp.Keys.DOWN_ARROW, true)) {
            this._curChoice = Math.min(this._curChoice+1, this._choices.length-1);
         }
         
      }
   },
   
   paintContent: {
      value: function(ctx, y) {
         'use strict';
         
         var x = this.x + Bubble.MARGIN + 10*game._scale;
         
         ctx.fillStyle = 'rgb(255,255,255)';
         for (var i=0; i<this._choices.length; i++) {
            if (this._curChoice === i) {
               game.drawArrow(this.x + Bubble.MARGIN, y);
            }
            game.drawString(this._choices[i], x, y);
            y += 10 * game._scale;
         }
         
      }
   },
   
   getSelectedChoice: {
      value: function() {
         return this._curChoice;
      }
   },
   
   setChoices: {
      value: function(choices) {
         this._choices = choices;
      }
   }
   
});

QuestionBubble.prototype.constructor = QuestionBubble;
