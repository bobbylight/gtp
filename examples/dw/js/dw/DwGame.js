var DwGame = function(args) {
   gtp.Game.call(this, args);
   this.map = null;
   this.hero = new Hero({ name: 'Erdrick' });
   
   this._bumpSoundDelay = 0;
};

DwGame.prototype = Object.create(gtp.Game.prototype);
//DwGame.prototype.constructor = DwGame;

DwGame.prototype.update = function() {
   gtp.Game.prototype.update.call(this);
};

DwGame.prototype.drawMap = function(ctx) {
   var hero = game.hero;
   var centerCol = hero.mapCol;
   var centerRow = hero.mapRow;
   var dx = hero.xOffs;
   var dy = hero.yOffs;
   this.map.draw(ctx, centerRow, centerCol, dx, dy);
};

/**
 * Starts loading a new map.  Fades out of the old one and into the new one.
 */
DwGame.prototype.loadMap = function(mapName, newRow, newCol) {
   newMap = this.getMapImpl(mapName);
   this.newRow = newRow;
   this.newCol = newCol;
   this.audio.playSound('stairs');
   var self = this;
   var updatePlayer = function() {
//      game.hero.mapCol -= 4;
self.setMap(mapName + '.json');
self.hero.mapRow = newRow;
self.hero.mapCol = newCol;
console.log('New row/col === ' + newRow + ', ' + newCol);
   };
   this.setState(new FadeOutInState(this.state, this.state, updatePlayer));
};

DwGame.prototype.getMapImpl = function(mapName) {

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

DwGame.prototype.setMap = function(assetName) {
   console.log('Setting map to: ' + assetName);
   this.map = this.maps[assetName];
};

DwGame.prototype.initLoadedMap = function(asset) {
   var data = this.assets.get(asset);
   var imagePathModifier = function(imagePath) {
      return imagePath.replace('../maps', 'res');
   };
   if (!this.maps) {
      this.maps = {};
   }
   var map = new tiled.TiledMap(data, {
      imagePathModifier: imagePathModifier,
      tileWidth: 16, tileHeight: 16,
      screenWidth: game.getWidth(), screenHeight: game.getHeight()
   });
   _adjustGameMap(map);
   map.setScale(this._scale);
   return this.maps[asset] = map;
};

var _adjustGameMap = function(map) {
   // Hide layers that shouldn't be shown (why aren't they marked as hidden
   // in Tiled?)
   for (var i=0; i<map.getLayerCount(); i++) {
      var layer = map.getLayerByIndex(i);
      if (layer.name !== 'tileLayer') {
         layer.visible = false;
      }
   }
};


DwGame.prototype.toggleShowCollisionLayer = function() {
   var layer = game.map.getLayer('collisionLayer');
   layer.visible = !layer.visible;
   this.setStatusMessage(layer.visible ?
         'Collision layer showing' : 'Collision layer hidden');
};

DwGame.prototype.toggleShowTerritoryLayer = function() {
   var layer = game.map.getLayer('enemyTerritoryLayer');
   layer.visible = !layer.visible;
   this.setStatusMessage(layer.visible ?
         'Territory layer showing' : 'Territory layer hidden');
};

DwGame.prototype.getTileSize = function() {
   return 16 * this._scale;
};

DwGame.prototype.getCollisionLayer = function() {
   return game.map.getLayer('collisionLayer');
};

DwGame.prototype.bump = function() {
   if (this._gameTime>this._bumpSoundDelay) {
      this.audio.playSound('bump');
      this._bumpSoundDelay = this._gameTime + 300;
   }
};

DwGame.prototype.setNpcsPaused = function(paused) {
   this.npcsPaused = paused;
};

DwGame.prototype.stringHeight = function() {
   return this.assets.get('font').cellH;//charHeight();
};

DwGame.prototype.stringWidth = function(str) {
   return str ? (str.length*this.assets.get('font').cellW) : 0;
};

DwGame.prototype.drawString = function(text, x, y) {
   this.assets.get('font').drawString(text, x, y);
};

DwGame.prototype.startRandomEncounter = function() {
   console.log('Start a random encounter!');
};
