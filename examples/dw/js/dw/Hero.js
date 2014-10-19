function Hero(args) {
   'use strict';
   RoamingEntity.call(this, args);
   
   this.name = args.name;
   this.level = 1;
   this.gold = 0;
   this.exp = 0;
   
   this.strength = 5;
   
   //BattleEntity.call(this, args); // TODO: Better way to do a mixin?
   //gtp.Utils.mixin(RoamingEntityMixin.prototype, this);
   //BattleEntityMixin.call(this);
   
}

Hero.STEP_INC = 0;

Hero.prototype = Object.create(RoamingEntity.prototype, {
   
   handleIntersectedObject: {
      value: function(/*TiledObject*/ obj) {
         'use strict';
         if ('warp' === obj.type) {
            var newRow = parseInt(obj.properties.row, 10);
            var newCol = parseInt(obj.properties.col, 10);
            var newDir = Direction.fromString(obj.properties.dir);
            game.loadMap(obj.properties. map, newRow, newCol, newDir);
         }
      }   
   },
   
   update: {
      value: function(delta) {
         'use strict';
         
         this._stepTick += delta;
         if (this._stepTick>=600) {
            this._stepTick -= 600;
            Hero.STEP_INC = 0;
         }
         else if (this._stepTick>=300) {
            Hero.STEP_INC = 1;
         }
         
         this.handleIsMovingInUpdate();
      
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         var tileSize = game.getTileSize();
         
         // TODO: Move SpriteSheets to AssetManager or somewhere else
         if (!this.spriteSheet) {
            this.spriteSheet = game.assets.get('hero');
         }
         
         var ssRow = 0, ssCol = 0;
         switch (this.direction) {
            case Direction.NORTH:
               ssCol = 4;
               break;
            case Direction.SOUTH:
               //ssCol = 0;
               break;
            case Direction.EAST:
               ssCol = 6;
               break;
            case Direction.WEST:
               ssCol = 2;
               break;
         }
         ssCol += Hero.STEP_INC;
         
         var x = (game.canvas.width - tileSize)/2;
         var y = (game.canvas.height - tileSize)/2;
         this.spriteSheet.drawSprite(ctx, x,y, ssRow, ssCol);
      //   ctx.drawImage(img, imgX,imgY,tileSize,tileSize, x,y,tileSize,tileSize);
      
      }
   },
   
   handlePostMove: {
      value: function() {
         'use strict';
         
         // See if we're supposed to warp to another map
         var warpLayer = game.map.getLayer('warpLayer');
         var tileSize = game.getTileSize();
         var x = this.mapCol * tileSize;
         var y = this.mapRow * tileSize;
         
         var obj = warpLayer.getObjectIntersecting(x, y, tileSize, tileSize);
         if (obj) {
            this.handleIntersectedObject(obj);
         }

         // See if we should fight a monster
         else {
            if (game.randomInt(20)===0) {
               game.startRandomEncounter();
            }
         }
      }
   },
   
   /**
    * Modifies the player's gold amount, and plays the appropriate sound effect.
    */
   addGold: {
      value: function(amt) {
         'use strict';
         this.gold = Math.max(0, this.gold + amt);
         //game.audio.playSound('gold');
      }
   }
   
});

Hero.prototype.constructor = Hero;
