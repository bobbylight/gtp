function TextBubble(game) {
   'use strict';
   var scale = game._scale;
   var margin = Bubble.MARGIN*scale;
   var width = game.getWidth() - 2*margin;
   var height = TextBubble.HEIGHT * scale;
   Bubble.call(this, null, margin, game.getHeight()-margin-height,
         width, height);
}

TextBubble.HEIGHT = 100;
TextBubble.CHAR_RENDER_MILLIS = 40;

TextBubble.prototype = Object.create(Bubble.prototype, {
   
   /**
    * Returns whether the user is "done" talking; that is, whether the entire
    * conversation has been rendered (including multiple pages, if necessary).
    */
   handleInput: {
      value: function() {
         'use strict';
         
         if (this._textDone && this._questionBubble) {
            var result = this._questionBubble.handleInput();
            return result;
         }
         
         var im = game.inputManager;
         if (!this._textDone &&
               (im.isKeyDown(gtp.Keys.X, true) || im.isKeyDown(gtp.Keys.Z, true))) {
            this._textDone = true;
            this._curLine = this._lines.length - 1;
         }
         else if (im.isKeyDown(gtp.Keys.X, true) || im.isKeyDown(gtp.Keys.Z, true)) {
            if (this._talkManager.hasNext()) {
               this.setText(this._talkManager.next());
               return false;
            }
            return true;
         }
         return false;
      }
   },
   
   update: {
      value: function(delta) {
         'use strict';
         
         if (!this._textDone) {
            this._curCharMillis += delta;
            if (this._curCharMillis > TextBubble.CHAR_RENDER_MILLIS) {
               this._curCharMillis -= TextBubble.CHAR_RENDER_MILLIS;
               this._curOffs++;
               if (this._curOffs === this._lines[this._curLine].length) {
                  if (this._curLine === this._lines.length-1) {
                     this._textDone = true;
                  }
                  else {
                     this._curLine++;
                  }
                  this._curOffs = 0;
               }
            }
         }
         
         else if (this._questionBubble) {
            this._questionBubble.update(delta);
         }
         
      }
   },
   
   paintContent: {
      value: function(ctx, y) {
         'use strict';
         
         var x = this.x + Bubble.MARGIN;
         
         ctx.fillStyle = 'rgb(255,255,255)';
         if (this._lines) {
            for (var i=0; i<=this._curLine; i++) {
               var text = this._lines[i];
               if (!this._textDone && i===this._curLine) {
                  text = text.substring(0, this._curOffs);
               }
               game.drawString(text, x, y);
               y += 10 * game._scale;
            }
            if (this._textDone && this._talkManager.hasNext()) {
               // TODO: Remove magic constants
               game.drawArrow(this.x+this.w-30, this.y+this.h-30);
            }
         }
         
         if (this._textDone && this._questionBubble) {
            this._questionBubble.paint(ctx);
         }
         
      }
   },
   
   /**
    * Renders text in this bubble.
    * 
    * @param {TalkSegment} text The text to render.
    * @member
    */
   setText: {
      value: function(text) {
         'use strict';
         this._text = text.text;
         if (this._text) {
            var w = this.w - 2*Bubble.MARGIN;
            this._lines = this._breakApart(this._text, w);
            this._curLine = this._curOffs = 0;
            this._curCharMillis = 0;
            this._textDone = false;
         }
         if (text.choices) {
            this._questionBubble = new QuestionBubble(game, text.choices);
         }
      }
   },
   
   setTalkManager: {
      value: function(talkManager) {
         'use strict';
         delete this._questionBubble;
         this._talkManager = talkManager;
         this.setText(this._talkManager.start());
      }
   }
   
});

TextBubble.prototype.constructor = TextBubble;
