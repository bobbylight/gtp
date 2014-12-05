var BattleState = function() {
   'use strict';
   _BaseState.apply(this, arguments);
};

BattleState.prototype = Object.create(_BaseState.prototype, {
   
   fight: {
      value: function() {
         'use strict';
         this._commandExecuting = true;
         this._fightDelay = new gtp.Delay({ millis: [ 300 ], callback: gtp.Utils.hitch(this, this._fightCallback) });
         game.audio.playSound('attack');
         this._textBubble.addToConversation({ text: 'You attack!' });
      }
   },
   
   _fightCallback: {
      value: function(param) {
         'use strict';
         game.audio.playSound('hit');
         delete this._fightDelay;
         this._enemyFlashDelay = new gtp.Delay({ millis: 400, callback: gtp.Utils.hitch(this, this._enemyFlashCallback) });
         this._flashMillis = 0;
      }
   },
   
   _enemyFlashCallback: {
      value: function() {
         'use strict';
         delete this._enemyFlashDelay;
         this._textBubble.addToConversation({ text: 'Direct hit! Command?' });
         this._commandExecuting = false;
      }
   },
   
   init: {
      value: function() {
         'use strict';
         gtp.State.prototype.init.apply(this, arguments); // Not defined in super, but in parent of super (?)
         this._commandBubble = new BattleCommandBubble();
         this._commandExecuting = false;
         this._textBubble = new TextBubble(game);
         var conversation = new Conversation();
         this._enemy = new Enemy(game.getEnemy('Slime'));
         conversation.addSegment({ text: 'A ' + this._enemy.name + ' draws near!  Command?' });
         this._textBubble.setConversation(conversation);
         this._enemyAttackShake = 0;
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
         var tileSize = game.getTileSize();
         
         var battleBG = game.assets.get('battleBG');
         var x = (width - battleBG.width)/2;
         var y = (height - battleBG.height)/2 - tileSize;
         battleBG.draw(ctx, x, y);
         
         if (this._enemy) {
            
            var flash = Math.round(this._flashMillis) % 40 > 20;
            var enemyImg = this._enemy.getImage(flash);
            x = (width - enemyImg.width) / 2;
            y += battleBG.height - tileSize/2 - enemyImg.height;
            enemyImg.draw(ctx, x, y);
            
            // Might not have had init() called yet if called from BattleTransitionState
            if (!this._commandExecuting && this._textBubble && this._textBubble.isDone()) {
               this._commandBubble.paint(ctx);
            }
            if (this._textBubble) {
               this._textBubble.paint(ctx);
            }
         
         }
         
      }
   },
   
   run: {
      value: function() {
         'use strict';
         this._commandExecuting = true;
         this._fightDelay = new gtp.Delay({ millis: [ 600 ], callback: gtp.Utils.hitch(this, this._runCallback) });
         game.audio.playSound('run');
         this._textBubble.addToConversation({ text: game.hero.name + ' started to run away.' });
      }
   },
   
   _runCallback: {
      value: function(param) {
         'use strict';
         delete this._fightDelay;
         var success = gtp.Utils.randomInt(0, 2) === 1;
         if (success) {
            this._commandExecuting = false;
            game.audio.fadeOutMusic(Sounds.MUSIC_OVERWORLD);
            game.setState(new RoamingState());
         }
         else {
            this._commandExecuting = false;
            this._commandBubble.reset();
            this._textBubble.addToConversation({ text: 'Couldn\'t run!' });
         }
      }
   },
   
   update: {
      value: function(delta) {
         'use strict';
         
         this.handleDefaultKeys();
         
         if (this._fightDelay) {
            this._fightDelay.update(delta);
         }
         if (this._enemyFlashDelay) {
            this._flashMillis += delta;
            this._enemyFlashDelay.update(delta);
         }
         
         if (!this._textBubble.isDone()) {
            this._textBubble.handleInput();
            this._textBubble.update(delta);
         }
         else if (!this._commandExecuting && this._commandBubble.handleInput()) {
            this._commandBubble.handleCommandChosen(this);
         }
         
      }
   }
   
});

BattleState.prototype.constructor = BattleState;
