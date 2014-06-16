var _RoamingSubState = Object.freeze({
   ROAMING: 0,
   MENU: 1
});

var RoamingState = function() {
};

RoamingState.prototype = new gtp.State();
RoamingState._totalTime = 0;

RoamingState.prototype.update = function(delta) {
   
   RoamingState._totalTime += delta;
   if (RoamingState._totalTime>=1000) {
      RoamingState._totalTime = 0;
   }
   
   var im = game.inputManager;
   
//   if (im.isKeyDown(gtp.InputManager.Z, true)) {
//      game.setNpcsPaused(true);
//      this._commandBubble.reset();
//      game.audio.playSound('menu');
//      this._substate = _RoamingSubState.MENU;
//      return;
//   }
//   
//   if (!hero.isMoving()) {
//      
//      var inc = 1 * game._scale;
//      
//      var maxX = game.map.getPixelWidth() * game._scale;
//      var maxY = game.map.getPixelHeight() * game._scale;
//      
      if (im.isKeyDown(gtp.InputManager.UP_ARROW)) {
         game.dy--;//hero.tryToMoveUp();
         //this.yOffs = Math.max(this.yOffs-inc, 0);
      }
      else if (im.isKeyDown(gtp.InputManager.DOWN_ARROW)) {
         game.dy++;//hero.tryToMoveDown();
         //this.yOffs = Math.min(this.yOffs+inc, maxY);
      }
      else if (im.isKeyDown(gtp.InputManager.LEFT_ARROW)) {
         game.dx--;//hero.tryToMoveLeft();
         //this.xOffs = Math.max(this.xOffs-inc, 0);
      }
      else if (im.isKeyDown(gtp.InputManager.RIGHT_ARROW)) {
         game.dx++;//hero.tryToMoveRight();
         //this.xOffs = Math.min(this.xOffs+inc, maxX);
      }
//      
//   }
//   
//   if (im.isKeyDown(gtp.InputManager.SHIFT)) {
//      if (im.isKeyDown(gtp.InputManager.C, true)) {
//         game.toggleShowCollisionLayer();
//      }
//      if (im.isKeyDown(gtp.InputManager.T, true)) {
//         game.toggleShowTerritoryLayer();
//      }
//      if (im.isKeyDown(gtp.InputManager.S, true)) {
//         game.audio.playSound('stairs');
//      }
//   }
   
};

RoamingState.prototype.render = function(ctx) {
   
   game.drawMap(ctx);
};
