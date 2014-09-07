var _RoamingSubState = Object.freeze({
   ROAMING: 0,
   MENU: 1,
   TALKING: 2
});

var RoamingState = function() {
   'use strict';
   
   this._substate = _RoamingSubState.ROAMING;
   
   this._updateMethods = {};
   this._updateMethods[_RoamingSubState.ROAMING] = this._updateRoaming;
   this._updateMethods[_RoamingSubState.MENU] = this._updateMenu;
   this._updateMethods[_RoamingSubState.TALKING] = this._updateTalking;
   
   this._textBubble = new TextBubble(game);
   this._showTextBubble = false;
   
   this._commandBubble = new CommandBubble();
};

RoamingState.prototype = Object.create(_BaseState.prototype, {
   
   _totalTime: {
      value: 0,
      writable: true
   },

   update: {
      value: function(delta) {
         'use strict';

         this.handleDefaultKeys();
         
         game.hero.update(delta);
         
         RoamingState._totalTime += delta;
         if (RoamingState._totalTime>=1000) {
            RoamingState._totalTime = 0;
         }
         
         this._updateMethods[this._substate].call(this, delta);
      }
   },
   
   _updateMenu: {
      value: function(delta) {
         'use strict';
         
         //var im = game.inputManager;
         var done = this._commandBubble.handleInput();
         if (done) {
            this._commandBubble.handleCommandChosen(this);
            return;
         }
      }
   },
   
   _updateRoaming: {
      value: function(delta) {
         'use strict';
         
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
         
         game.map.npcs.forEach(function(npc) {
            npc.update(delta);
         });
         
      }
   },
   
   _updateTalking: {
      value: function(delta) {
         'use strict';
         
         var done = this._textBubble.handleInput();
         if (this._showTextBubble) {
            this._textBubble.update(delta);
         }
         
         if (done) {
            this.startRoaming();
            return;
         }
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         game.drawMap(ctx);
         game.hero.render(ctx);
         
         game.map.npcs.forEach(function(npc) {
            npc.render(ctx);
         });
         
         if (this._substate===_RoamingSubState.MENU) {
            this._commandBubble.paint(ctx);
         }
         
         if (this._showTextBubble) {
            this._textBubble.paint(ctx);
         }
      }
   },
   
   startRoaming: {
      value: function() {
         'use strict';
         game.setNpcsPaused(false);
         this._showTextBubble = false;
         this._substate = _RoamingSubState.ROAMING;
      }
   },
   
   talkToNpc: {
      value: function() {
         'use strict';
         
         var logic = game.getMapLogic();
         if (!logic) {
            console.log('Error: No map logic found for this map!  Cannot talk to NPCs!');
            return;
         }
         
         var npc = game.getNpcHeroIsFacing();
         if (npc) {
            var hero = game.hero;
            //var newNpcDir = this.getHero().direction.opposite();
            var newNpcDir = (hero.direction + 2) % 4;
            npc.direction = newNpcDir;
            this._textBubble.setText(logic.npcText(npc));
         }
         else {
            this._textBubble.setText('There is nobody in that direction!');
         }
         this._showTextBubble = true;
         this._substate = _RoamingSubState.TALKING;
      }
   }
   
});

RoamingState.prototype.constructor = RoamingState;
