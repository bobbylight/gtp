//var _RoamingSubState = Object.freeze({
//   ROAMING: 0,
//   MENU: 1
//});

var RoamingState = function() {
};

RoamingState._totalTime = 0;

RoamingState.prototype = Object.create(_BaseState.prototype, {
   
   update: {
      value: function(delta) {
         'use strict';
         
         RoamingState._totalTime += delta;
         if (RoamingState._totalTime>=1000) {
            RoamingState._totalTime = 0;
         }
         
         var im = game.inputManager;
         var hero = game.hero;
         hero.update(delta);
         
      //   if (im.isKeyDown(gtp.Keys.Z, true)) {
      //      game.setNpcsPaused(true);
      //      this._commandBubble.reset();
      //      game.audio.playSound('menu');
      //      this._substate = _RoamingSubState.MENU;
      //      return;
      //   }
      //   
         if (!hero.isMoving()) {
            
//            var inc = 1 * game._scale;
//            
//            var maxX = game.map.getPixelWidth() * game._scale;
//            var maxY = game.map.getPixelHeight() * game._scale;
            
            if (im.up()) {
               hero.tryToMoveUp();
               //this.yOffs = Math.max(this.yOffs-inc, 0);
            }
            else if (im.down()) {
               hero.tryToMoveDown();
               //this.yOffs = Math.min(this.yOffs+inc, maxY);
            }
            else if (im.left()) {
               hero.tryToMoveLeft();
               //this.xOffs = Math.max(this.xOffs-inc, 0);
            }
            else if (im.right()) {
               hero.tryToMoveRight();
               //this.xOffs = Math.min(this.xOffs+inc, maxX);
            }
            
         }
      //   
      //   if (im.isKeyDown(gtp.Keys.SHIFT)) {
      //      if (im.isKeyDown(gtp.Keys.C, true)) {
      //         game.toggleShowCollisionLayer();
      //      }
      //      if (im.isKeyDown(gtp.Keys.T, true)) {
      //         game.toggleShowTerritoryLayer();
      //      }
      //      if (im.isKeyDown(gtp.Keys.S, true)) {
      //         game.audio.playSound('stairs');
      //      }
      //   }
         
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         game.drawMap(ctx);
         game.hero.render(ctx);
      }
   }

});

RoamingState.prototype.constructor = RoamingState;
