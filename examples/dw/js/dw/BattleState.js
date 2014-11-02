var BattleState = function() {
   'use strict';
   _BaseState.apply(this, arguments);
};

BattleState.prototype = Object.create(_BaseState.prototype, {
   
   fight: {
      value: function() {
         'use strict';
         this._textBubble.addToConversation({ text: 'Not implemented, command?' });
      }
   },
   
   init: {
      value: function() {
         'use strict';
         gtp.State.prototype.init.apply(this, arguments); // Not defined in super, but in parent of super (?)
         this._commandBubble = new BattleCommandBubble();
         this._textBubble = new TextBubble(game);
         var conversation = new Conversation();
         conversation.addSegment({ text: 'A Slime draws near!  Command?' });
         this._textBubble.setConversation(conversation);
      }
   },
   
   item: {
      value: function() {
         'use strict';
         this._textBubble.addToConversation({ text: 'Not implmented, command?' });
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         game.drawMap(ctx);
         var width = game.getWidth();
         var height = game.getHeight();
         
         var battleBG = game.assets.get('battleBG');
         var x = (width - battleBG.width)/2;
         var y = (height - battleBG.height)/2;
         battleBG.draw(ctx, x, y);
         
         var enemyImg = game.assets.get('Slime');
         x = (width - enemyImg.width) / 2;
         y = height/2 + 50 - enemyImg.height;//(height - enemyImg.height) / 2;
         enemyImg.draw(ctx, x, y);
         
         // Might not have had init() called yet if called from BattleTransitionState
         if (this._textBubble && this._textBubble.isDone() && this._commandBubble) {
            this._commandBubble.paint(ctx);
         }
         if (this._textBubble) {
            this._textBubble.paint(ctx);
         }
         
      }
   },
   
   tryToRun: {
      value: function() {
         'use strict';
         game.audio.playSound('run');
         game.audio.fadeOutMusic(Sounds.MUSIC_OVERWORLD);
         game.setState(new RoamingState());
      }
   },
   
   update: {
      value: function(delta) {
         'use strict';
         
         this.handleDefaultKeys();
         
         if (!this._textBubble.isDone()) {
            this._textBubble.handleInput();
            this._textBubble.update(delta);
         }
         else if (this._commandBubble.handleInput()) {
            this._commandBubble.handleCommandChosen(this);
         }
         
      }
   }
   
});

BattleState.prototype.constructor = BattleState;
