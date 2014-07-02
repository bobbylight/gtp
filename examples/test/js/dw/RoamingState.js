var _RoamingSubState = Object.freeze({
   ROAMING: 0,
   MENU: 1
});

var RoamingState = function() {
   this._substate = _RoamingSubState.ROAMING;
   
   this._updateMethods = {};
   this._updateMethods[_RoamingSubState.ROAMING] = this._updateRoaming;
   this._updateMethods[_RoamingSubState.MENU] = this._updateMenu;
   
   var margin = 10;
   var x = margin;
   var w = game.canvas.width - 2*margin;
   var h = 150;
   var y = game.canvas.height - h - margin;
   this._textBubble = new Bubble('Hello', x, y, w, h);
   
   this._commandBubble = new CommandBubble();
};

RoamingState.prototype = new gtp.State();
RoamingState._totalTime = 0;

RoamingState.prototype.update = function(delta) {
   
   game.hero.update(delta);
   
   RoamingState._totalTime += delta;
   if (RoamingState._totalTime>=1000) {
      RoamingState._totalTime = 0;
   }
   
   this._updateMethods[this._substate].call(this, delta);
   
};

RoamingState.prototype._updateMenu = function(delta) {
   
   var im = game.inputManager;
   var done = this._commandBubble.handleInput();
   if (done) {
      this._commandBubble.handleCommandChosen(this);
      return;
   }
   
};

RoamingState.prototype._updateRoaming = function(delta) {
   
   var hero = game.hero;
   var im = game.inputManager;
   
   if (im.isKeyDown(gtp.Keys.Z, true)) {
      game.setNpcsPaused(true);
      this._commandBubble.reset();
      game.audio.playSound('menu');
      this._substate = _RoamingSubState.MENU;
      return;
   }
   
   if (!hero.isMoving()) {
      
      var inc = 1 * game._scale;
      
      var maxX = game.map.getPixelWidth() * game._scale;
      var maxY = game.map.getPixelHeight() * game._scale;
      
      if (im.isKeyDown(gtp.Keys.UP_ARROW)) {
         hero.tryToMoveUp();
         //this.yOffs = Math.max(this.yOffs-inc, 0);
      }
      else if (im.isKeyDown(gtp.Keys.DOWN_ARROW)) {
         hero.tryToMoveDown();
         //this.yOffs = Math.min(this.yOffs+inc, maxY);
      }
      else if (im.isKeyDown(gtp.Keys.LEFT_ARROW)) {
         hero.tryToMoveLeft();
         //this.xOffs = Math.max(this.xOffs-inc, 0);
      }
      else if (im.isKeyDown(gtp.Keys.RIGHT_ARROW)) {
         hero.tryToMoveRight();
         //this.xOffs = Math.min(this.xOffs+inc, maxX);
      }
      
   }
   
   if (im.isKeyDown(gtp.Keys.SHIFT)) {
      if (im.isKeyDown(gtp.Keys.C, true)) {
         game.toggleShowCollisionLayer();
      }
      if (im.isKeyDown(gtp.Keys.T, true)) {
         game.toggleShowTerritoryLayer();
      }
      if (im.isKeyDown(gtp.Keys.S, true)) {
         game.audio.playSound('stairs');
      }
   }
   
};

RoamingState.prototype.render = function(ctx) {
   
   game.drawMap(ctx);
   game.hero.render(ctx);
   
   if (this._substate===_RoamingSubState.MENU) {
      this._commandBubble.paint(ctx);
   }
};

RoamingState.prototype.startRoaming = function() {
   game.setNpcsPaused(false);
   this._substate = _RoamingSubState.ROAMING;
};
