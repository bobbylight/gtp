var DwGame = function(args) {
   gtp.Game.call(this, args);
   this.map = null;
   this._drawMapCount = 0;
   this.hero = new Hero({ name: 'Erdrick' });
   this.npcs = [];
   
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
         this._drawMapCount++;
//         if (this._drawMapCount === 10) {
//            this.timer.start('drawMap');
//         }
         this.map.draw(ctx, centerRow, centerCol, dx, dy);
//         if (this._drawMapCount === 10) {
//            this.timer.endAndLog('drawMap');
//            this._drawMapCount = 0;
//         }
      }
   },
   
   getMapXOffs: {
      value: function() {
         var hero = game.hero;
         var centerCol = hero.mapCol;
         var dx = hero.xOffs;
         var tileSize = this.getTileSize();
         var xOffs = centerCol*tileSize + tileSize/2 + dx - this.getWidth()/2;
         return xOffs;
      },
   },
      
   getMapYOffs: {
      value: function() {
         var hero = game.hero;
         var centerRow = hero.mapRow;
         var dy = hero.yOffs;
         var tileSize = this.getTileSize();
         var yOffs = centerRow*tileSize + tileSize/2 + dy - this.getHeight()/2;
         return yOffs;
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
         
         map = this.assets.get(mapName + '.json');
         //map = MapLoader.load(in, new Java2DTilesetFactory(), SCALE);
         
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

         var i, npc;
         
         // Hide layers that shouldn't be shown (why aren't they marked as hidden
         // in Tiled?)
         for (i=0; i<map.getLayerCount(); i++) {
            var layer = map.getLayerByIndex(i);
            if (layer.name !== 'tileLayer') {
               layer.visible = false;
            }
         }
         
         // We special-case the NPC layer
         var newNpcs = [];
         var temp = map.getLayer("npcLayer");
         if (temp && temp.isObjectGroup()) {
            var npcLayer = temp;
            for (i=0; i<npcLayer.objects.length; i++) {
               var obj = npcLayer.objects[i];
               if ('npc'===obj.type) { // Always true
                  npc = this._parseNpc(obj);
                  npc.setNpcIndex(newNpcs.length+1);
                  newNpcs.push(npc);
               }
               else {
                  console.log('warn: Unhandled object type (expected npc): ' + obj.type);
               }
            }
            map.removeLayer("npcs");
         }
         
         map.npcs = newNpcs;
         for (i=0; i<map.npcs.length; i++) {
            npc = map.npcs[i];
            map.getLayer("collisionLayer").setData(npc.mapRow, npc.mapCol, 1);
         }
         
//         // Hide layers we aren't interested in seeing.
//         map.getLayer("collisionLayer").setVisible(collisionLayerVisible);
//         Layer layer = map.getLayer("enemyTerritoryLayer");
//         if (layer!=null) {
//            layer.setVisible(enemyTerritoryLayerVisible);
//         }
      
      }
   },
   
   _parseNpc: {
      value: function(obj) {
         var index = 0;
         var type = NpcType.MERCHANT_GREEN;//obj.type;
         var tileSize = this.getTileSize();
         var row = obj.y / tileSize;
         var col = obj.x / tileSize;
         var dir = Direction.SOUTH;
         var tempDir = obj.dir;
         if (tempDir) {
            dir = tempDir;
         }
         var wanders = true;
         var wanderStr = obj.wanders;
         if (wanderStr) {
            wanders = wanderStr==='true';
         }
         var npc = new Npc({ type: type, dir: dir, wanders: wanders,
                             mapRow: row, mapCol: col });
         return npc;
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
