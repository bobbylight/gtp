function Npc(args) {
   'use strict';
   
   RoamingEntity.call(this, args);
   gtp.Utils.mixin(args, this);
//   this.type = NpcType.MERCHANT;
//   this.wanders = false;
//   
   this._stepDelay = new gtp.Delay(3000, -500, 500);
   
   //gtp.Utils.mixin(RoamingEntityMixin.prototype, this);
   //RoamingEntityMixin.call(this);
}

Npc.prototype = Object.create(RoamingEntity.prototype, {
   
   // TODO: Change NPC image to remove the need for this
   _computeColumn: {
      value: function() {
         'use strict';
         switch (this.direction) {
            case Direction.NORTH:
               return 4;
            case Direction.EAST:
               return 2;
            default:
            case Direction.SOUTH:
               return 0;
            case Direction.WEST:
               return 6;
         }
      }
   },
   
   update: {
      value: function(delta) {
         'use strict';
      
         if (this._stepDelay.update(delta)) {
            this._step();
            this._stepDelay.reset();
         }
         else {
            this.handleIsMovingInUpdate();
         }
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         var ss = game.assets.get('npcs');
         var ssRow = this.type;
         var ssCol = this._computeColumn();
         var x = this.mapCol * game.getTileSize();
   x -= game.getMapXOffs();
   x += this.xOffs;
         var y = this.mapRow * game.getTileSize();
   y -= game.getMapYOffs();
   y += this.yOffs;
         ssCol += Hero.STEP_INC;
         ss.drawSprite(ctx, x,y, ssRow,ssCol);
      }
   },
   
   setNpcIndex: {
      value: function(index) {
         'use strict';
         this.npcIndex = index;
      }
   },
   
   _step: {
      value: function() {
         'use strict';
         var dirFuncs = [ this.tryToMoveUp, this.tryToMoveDown,
               this.tryToMoveRight, this.tryToMoveLeft ];
         var triedToMove;
         while (!triedToMove) {
            var newDir = gtp.Utils.randomInt(0, 4);
            dirFuncs[newDir].call(this);
            // TODO: Provide means, in map or elsewhere, to restrict an NPC to
            // a specific region on the map.
            triedToMove = true;
         }
      }
   }
   
});

Npc.prototype.constructor = Npc;
