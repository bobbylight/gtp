/**
 * The hero is the main party member.
 * @constructor
 */
Hero = function(args) {
   'use strict';
   RoamingEntity.call(this, args);
};

Hero.STEP_INC = 0;

Hero.prototype = Object.create(RoamingEntity.prototype, {
   
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
               ssRow = 0;
               break;
            case Direction.SOUTH:
               ssRow = 2;
               break;
            case Direction.EAST:
               ssRow = 1;
               break;
            case Direction.WEST:
               ssRow = 3;
               break;
         }
         ssCol += (Hero.STEP_INC * 2);
         console.log(this.xOffs + ', ' + this.yOffs + ', ' + Hero.STEP_INC);
         
         var x = (game.canvas.width - tileSize)/2;
         var y = (game.canvas.height - tileSize)/2;
         this.spriteSheet.drawSprite(ctx, x,y, ssRow, ssCol);
      //   ctx.drawImage(img, imgX,imgY,tileSize,tileSize, x,y,tileSize,tileSize);
      
      }
   }
   
});

Hero.prototype.constructor = Hero;
