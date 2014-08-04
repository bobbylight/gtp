function Npc(args) {
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
   
   update: function(delta) {
      // TODO
   },
   
   render: function(ctx) {
      
      var ss = game.assets.get('npcs');
      var ssRow = this.type;
      var ssCol = 0;
      var x = this.mapCol * game.getTileSize();
x -= game.getMapXOffs();
      var y = this.mapRow * game.getTileSize();
y -= game.getMapYOffs();
      ss.drawSprite(ctx, x,y, ssRow,ssCol);
   },
   
   setMapLocation: function(row, col) {
      this.mapRow = row;
      this.mapCol = col;
      this.xOffs = this.yOffs = 0;
   },
   
   setNpcIndex: function(index) {
      this.npcIndex = index;
   }
   
};
