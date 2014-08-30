function Hero(args) {
   'use strict';
   BattleEntity.call(this, args);
   
   this.name = args.name;
   this.direction = Direction.SOUTH;
   this.mapCol = 0;
   this.mapRow = 0;
   this.xOffs = 0;
   this.yOffs = 0;
   this.level = 1;
   this.gold = 0;
   this.exp = 0;
   this.walkTick = 0;
   
   this._stepTick = 0;
}

Hero.STEP_INC = 0;

/**
 * TODO: This might not be used.  Remove if so.
 */
Hero.MAX_WALK_TICK = 0;
   
Hero.prototype = Object.create(BattleEntity.prototype, {
   
   handleIntersectedObject: {
      value: function(/*TiledObject*/ obj) {
         'use strict';
         if ('warp' === obj.type) {
            var newRow = parseInt(obj.properties.row, 10);
            var newCol = parseInt(obj.properties.col, 10);
            game.loadMap(obj.properties. map, newRow, newCol);
         }
      }   
   },
   
   isMoving: {
      value: function() {
         'use strict';
         return this.xOffs!==0 || this.yOffs!==0;
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
         
         if (this.isMoving()) {
            if (this.walkTick>0) {
               this.walkTick--;
            }
            
            else {
               this.walkTick = Hero.MAX_WALK_TICK;
               if (this.xOffs<0) {
                  this.xOffs += this.getMoveIncrement();
               }
               else if (this.xOffs>0) {
                  this.xOffs -= this.getMoveIncrement();
               }
               else if (this.yOffs<0) {
                  this.yOffs += this.getMoveIncrement();
               }
               else if (this.yOffs>0) {
                  this.yOffs -= this.getMoveIncrement();
               }
               if (!this.isMoving()) {
      
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
      
            }
            
         }
      
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
   
   getMoveIncrement: {
      value: function() {
         'use strict';
         return game._scale * 2;
      }
   },
   
   setMapLocation: {
      value: function(row, col) {
         'use strict';
         this.mapRow = row;
         this.mapCol = col;
         this.xOffs = this.yOffs = 0;
      }
   },
   
   /**
    * Tries to move the player onto the specified tile.
    *
    * @param row
    * @param col
    * @return Whether the move was successful.
    */
   _tryToMove: {
      value: function(row, col) {
         'use strict';
         var data = game.getCollisionLayer().getData(row, col);
         var canWalk = data===0;//-1;
         if (canWalk) {
            this.mapRow = row;
            this.mapCol = col;
            this.walkTick = Hero.MAX_WALK_TICK;
         }
         else if (data===361) { // i.e., not an NPC
            game.bump();
         }
         /*
         else {
            console.log("Can't walk (" + row + ", " + col + "): " + data);
         }
         */
         return canWalk;
      }
   },
   
   
   tryToMoveLeft: {
      value: function() {
         'use strict';
         var col = this.mapCol - 1;
         if (col<0) {
            col += game.map.colCount;
         }
         if (this._tryToMove(this.mapRow, col)) {
            this.xOffs = game.getTileSize();
         }
         this.direction = Direction.WEST;
      }
   },
   
   tryToMoveRight: {
      value: function() {
         'use strict';
         var col = Math.floor((this.mapCol+1) % game.map.colCount);
         if (this._tryToMove(this.mapRow, col)) {
            this.xOffs = -game.getTileSize();
         }
         this.direction = Direction.EAST;
      }
   },
   
   tryToMoveUp: {
      value: function() {
         'use strict';
         var row = this.mapRow - 1;
         if (row<0) {
            row += game.map.rowCount;
         }
         if (this._tryToMove(row, this.mapCol)) {
            this.yOffs += game.getTileSize();
         }
         this.direction = Direction.NORTH;
      }
   },
   
   tryToMoveDown: {
      value: function() {
         'use strict';
         var row = Math.floor((this.mapRow+1) % game.map.rowCount);
         if (this._tryToMove(row, this.mapCol)) {
            this.yOffs -= game.getTileSize();
         }
         this.direction = Direction.SOUTH;
      }
   }
   
});

Hero.prototype.constructor = Hero;
