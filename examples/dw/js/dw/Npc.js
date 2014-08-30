function Npc(args) {
   'use strict';
   gtp.Utils.mixin(args, this);
//   this.type = NpcType.MERCHANT;
//   this.dir = Direction.SOUTH;
//   this.wanders = false;
//   
//   this.mapCol = args.mapRow;
//   this.mapRow = args.mapCol;
   this.xOffs = 0;
   this.yOffs = 0;
   this._stepTick = 0;
}

Npc.prototype = {
   
   // TODO: Change NPC image to remove the need for this
   _computeColumn: function() {
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
   },
   
   update: function(delta) {
      // TODO
   },
   
   render: function(ctx) {
      'use strict';
      
      var ss = game.assets.get('npcs');
      var ssRow = this.type;
      var ssCol = this._computeColumn();
      var x = this.mapCol * game.getTileSize();
x -= game.getMapXOffs();
      var y = this.mapRow * game.getTileSize();
y -= game.getMapYOffs();
      ssCol += Hero.STEP_INC;
      ss.drawSprite(ctx, x,y, ssRow,ssCol);
   },
   
   setMapLocation: function(row, col) {
      'use strict';
      this.mapRow = row;
      this.mapCol = col;
      this.xOffs = this.yOffs = 0;
   },
   
   setNpcIndex: function(index) {
      'use strict';
      this.npcIndex = index;
   }
   
};
