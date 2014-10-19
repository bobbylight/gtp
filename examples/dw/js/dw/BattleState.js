var BattleState = function() {
   'use strict';
   _BaseState.apply(this, arguments);
};

BattleState.prototype = Object.create(_BaseState.prototype, {
   
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
         
      }
   },
   
   update: {
      value: function(delta) {
         'use strict';
         
         this.handleDefaultKeys();
         
         var im = game.inputManager;
         if (im.isKeyDown(gtp.Keys.ENTER)) {
            game.setState(new RoamingState());
         }
         
      }
   }
   
});

BattleState.prototype.constructor = BattleState;
