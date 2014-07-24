var DwGame = function(args) {
   gtp.Game.call(this, args);
   this.map = null;
   this.hero = new Hero({ name: 'Erdrick' });
   
   this._bumpSoundDelay = 0;
};

DwGame.prototype = Object.create(gtp.Game.prototype, {

   update: {
      value: function() {
         gtp.Game.prototype.update.call(this);
      }
   },
   
   drawMap: {
      value: function(ctx) {
         var hero = game.hero;
         var centerCol = hero.mapCol;
         var centerRow = hero.mapRow;
         var dx = hero.xOffs;
         var dy = hero.yOffs;
         this.map.draw(ctx, centerRow, centerCol, dx, dy);
      }
   },
   
   /**
    * Starts loading a new map.  Fades out of the old one and into the new one.
    */
   loadMap: {
      value: function(mapName, newRow, newCol) {
         newMap = this.getMapImpl(mapName);
         this.newRow = newRow;
         this.newCol = newCol;
         this.audio.playSound('stairs');
         var self = this;
         var updatePlayer = function() {
            self.setMap(mapName + '.json');
            self.hero.setMapLocation(newRow, newCol);
            self.inputManager.clearKeyStates(); // Prevent keydown from being read in the next screen
         };
         this.setState(new FadeOutInState(this.state, this.state, updatePlayer));
      }
   },
   
   getMapImpl: {
      value: function(mapName) {
      
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
      }
   },
   
   setMap: {
      value: function(assetName) {
         console.log('Setting map to: ' + assetName);
         this.map = this.maps[assetName];
      }
   },
   
   initLoadedMap: {
      value: function(asset) {
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
         this._adjustGameMap(map);
         map.setScale(this._scale);
         this.maps[asset] = map;
         return map;
      }
   },
   
   _adjustGameMap: { // TODO: Wrap class in closure and hide this function
      value: function(map) {
         // Hide layers that shouldn't be shown (why aren't they marked as hidden
         // in Tiled?)
         for (var i=0; i<map.getLayerCount(); i++) {
            var layer = map.getLayerByIndex(i);
            if (layer.name !== 'tileLayer') {
               layer.visible = false;
            }
         }
      }
   },
   
   toggleShowCollisionLayer: {
      value: function() {
         var layer = game.map.getLayer('collisionLayer');
         layer.visible = !layer.visible;
         this.setStatusMessage(layer.visible ?
               'Collision layer showing' : 'Collision layer hidden');
      }
   },
   
   toggleShowTerritoryLayer: {
      value: function() {
         var layer = game.map.getLayer('enemyTerritoryLayer');
         layer.visible = !layer.visible;
         this.setStatusMessage(layer.visible ?
               'Territory layer showing' : 'Territory layer hidden');
      }
   },
   
   getTileSize: {
      value: function() {
         return 16 * this._scale;
      }
   },
   
   getCollisionLayer: {
      value: function() {
         return game.map.getLayer('collisionLayer');
      }
   },
   
   bump: {
      value: function() {
         if (this._gameTime>this._bumpSoundDelay) {
            this.audio.playSound('bump');
            this._bumpSoundDelay = this._gameTime + 300;
         }
      }
   },
   
   setNpcsPaused: {
      value: function(paused) {
         this.npcsPaused = paused;
      }
   },
   
   stringHeight: {
      value: function() {
         return this.assets.get('font').cellH;//charHeight();
      }
   },
   
   stringWidth: {
      value: function(str) {
         return str ? (str.length*this.assets.get('font').cellW) : 0;
      }
   },
   
   drawString: {
      value: function(text, x, y) {
         this.assets.get('font').drawString(text, x, y);
      }
   },
   
   startRandomEncounter: {
      value: function() {
         console.log('Start a random encounter!');
      }
   }

});

DwGame.prototype.constructor = DwGame;
