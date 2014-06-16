var TestGame = function(args) {
   gtp.Game.call(this, args);
   this.map = null;
   this.dx = this.dy = 0;
};

TestGame.prototype = Object.create(gtp.Game.prototype);
//TestGame.prototype.constructor = TestGame;

TestGame.LOAD_MAP_FADE_INC = 30000000;
TestGame.MAX_LOAD_MAP_STEP = 30;

TestGame.prototype.update = function() {
   gtp.Game.prototype.update.call(this);
};

TestGame.prototype.drawMap = function(ctx) {
   //var hero = game.hero;
   var centerCol = 20;//hero.mapCol;
   var centerRow = 20;//hero.mapRow;
   var dx = this.dx;//hero.xOffs;
   var dy = this.dy;//hero.yOffs;
   this.map.draw(ctx, centerRow, centerCol, dx, dy);
};

TestGame.prototype.loadMap = function(mapName, newRow, newCol) {
   newMap = this.getMapImpl(mapName);
   this.newRow = newRow;
   this.newCol = newCol;
   this.loadMapStep = TestGame.MAX_LOAD_MAP_STEP;
//   this.loadMapTime = getPlayTimeNanos() + TestGame.LOAD_MAP_FADE_INC;
   this.audio.playSound('stairs');
};

TestGame.prototype.getMapImpl = function(mapName) {

   var map = null;
   var newNpcs = [];
   
   map = this.assets.get(mapName + '.json');
   //map = MapLoader.load(in, new Java2DTilesetFactory(), SCALE);
   
//   // We special-case the NPC layer
//   Layer temp = map.getLayer("npcLayer");
//   if (temp instanceof ObjectGroup) {
//      ObjectGroup npcLayer = (ObjectGroup)temp;
//      for (int i=0; i<npcLayer.getObjectCount(); i++) {
//         Obj obj = npcLayer.getObject(i);
//         if ("npc".equals(obj.getType())) { // Always true
//            Npc npc = parseNpc(obj);
//            npc.setNpcIndex(newNpcs.size()+1);
//            newNpcs.add(npc);
//         }
//      }
//      map.removeLayer("npcs");
//   }
//
//      npcs = newNpcs;
//      for (Npc npc : npcs) {
//         map.getLayer("collisionLayer").setData(npc.getRow(), npc.getCol(), 1);
//      }

//      // Hide layers we aren't interested in seeing.
//      map.getLayer("collisionLayer").setVisible(collisionLayerVisible);
//      Layer layer = map.getLayer("enemyTerritoryLayer");
//      if (layer!=null) {
//         layer.setVisible(enemyTerritoryLayerVisible);
//      }

   return map;

};

TestGame.prototype.toggleShowCollisionLayer = function() {
   var layer = game.map.getLayer('collisionLayer');
   layer.visible = !layer.visible;
   this.setStatusMessage(layer.visible ?
         'Collision layer showing' : 'Collision layer hidden');
};

TestGame.prototype.toggleShowTerritoryLayer = function() {
   var layer = game.map.getLayer('enemyTerritoryLayer');
   layer.visible = !layer.visible;
   this.setStatusMessage(layer.visible ?
         'Territory layer showing' : 'Territory layer hidden');
};

TestGame.prototype.getTileSize = function() {
   return 16 * this._scale;
};

TestGame.prototype.getCollisionLayer = function() {
   return game.map.getLayer('collisionLayer');
};

TestGame.prototype.stringHeight = function() {
   return this.assets.get('font').cellH;//charHeight();
};

TestGame.prototype.stringWidth = function(str) {
   return str ? (str.length*this.assets.get('font').cellW) : 0;
};

TestGame.prototype.drawString = function(text, x, y) {
   this.assets.get('font').drawString(text, x, y);
};
