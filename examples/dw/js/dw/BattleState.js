var BattleState = function() {
   'use strict';
   _BaseState.apply(this, arguments);
};

BattleState.prototype = Object.create(_BaseState.prototype, {
   
   init: {
      value: function(game) {
         'use strict';
         gtp.State.prototype.init.apply(this, arguments); // Not defined in super, but in parent of super (?)
         this._commandBubble = new BattleCommandBubble();
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
         var x = (width - enemyImg.width) / 2;
         var y = height/2 + 50 - enemyImg.height;//(height - enemyImg.height) / 2;
         enemyImg.draw(ctx, x, y);
         
         // Might not have had init() called yet if called from BattleTransitionState
         if (this._commandBubble) {
            this._commandBubble.paint(ctx);
         }
      }
   },
   
   tryToRun: {
      value: function() {
         'use strict';
         game.audio.playSound('run');
         game.setState(new RoamingState());
      }
   },
   
   update: {
      value: function(delta) {
         'use strict';
         
         this.handleDefaultKeys();
         
         if (this._commandBubble.handleInput()) {
            this._commandBubble.handleCommandChosen(this);
         }
         
      }
   }
   
});

BattleState.prototype.constructor = BattleState;
