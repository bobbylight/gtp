var DwGame = function(args) {
   'use strict';
   gtp.Game.call(this, args);
   this.map = null;
   this._drawMapCount = 0;
   this.hero = new Hero({ name: 'Erdrick' });
   this.npcs = [];
   
   this._bumpSoundDelay = 0;
   this._mapLogics = {};
};

DwGame.prototype = Object.create(gtp.Game.prototype, {

   update: {
      value: function() {
         'use strict';
         gtp.Game.prototype.update.call(this);
      }
   },
   
   drawMap: {
      value: function(ctx) {
         'use strict';
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
   
   getMapLogic: {
      value: function() {
         'use strict';
         var logicFile = this.map.properties.logicFile;
         logicFile = logicFile.charAt(0).toUpperCase() + logicFile.substring(1);
         console.log(logicFile);
         var logic = this._mapLogics[logicFile];
         if (!logic) {
            logic = this._mapLogics[logicFile] = new window[logicFile]();
         }
         console.log('... ' + logic);
         return logic;
      }
   },
   
   getMapXOffs: {
      value: function() {
         'use strict';
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
         'use strict';
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
         'use strict';
//         newMap = this.getMapImpl(mapName);
         this.newRow = newRow;
         this.newCol = newCol;
         this.audio.playSound('stairs');
         var self = this;
         var updatePlayer = function() {
            self.setMap(mapName + '.json');
            self.hero.setMapLocation(newRow, newCol);
            self.inputManager.clearKeyStates(); // Prevent keydown from being read in the next screen
         };
         this.setState(new /*FadeOutInState*/MapChangeState(this.state, this.state, updatePlayer));
      }
   },
   
   getMapImpl: {
      value: function(mapName) {
         'use strict';
         
         var map = null;
         
         map = this.assets.get(mapName + '.json');
         //map = MapLoader.load(in, new Java2DTilesetFactory(), SCALE);
         
         return map;
      }
   },
   
   setMap: {
      value: function(assetName) {
         'use strict';
         console.log('Setting map to: ' + assetName);
         this.map = this.maps[assetName];
      }
   },
   
   initLoadedMap: {
      value: function(asset) {
         'use strict';
         
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
         'use strict';

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
         var newTalkAcrosses = {};
         var temp = map.getLayer("npcLayer");
         if (temp && temp.isObjectGroup()) {
            var npcLayer = temp;
            for (i=0; i<npcLayer.objects.length; i++) {
               var obj = npcLayer.objects[i];
               if ('npc'===obj.type) {
                  npc = this._parseNpc(obj);
                  npc.setNpcIndex(newNpcs.length+1);
                  newNpcs.push(npc);
               }
               else if ('talkAcross'===obj.type) {
                  newTalkAcrosses[this._parseTalkAcrossKey(obj)] = true;
               }
               else {
                  console.error('Unhandled object type in tiled map: ' + obj.type);
               }
            }
            map.removeLayer("npcs");
         }
         
         map.npcs = newNpcs;
         for (i=0; i<map.npcs.length; i++) {
            npc = map.npcs[i];
            map.getLayer("collisionLayer").setData(npc.mapRow, npc.mapCol, 1);
         }
         map.talkAcrosses = newTalkAcrosses;
         
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
         'use strict';
         //var index = 0;
         var name = obj.name;
         var type = NpcType.MERCHANT_GREEN;//obj.type;
         var tileSize = this.getTileSize();
         var row = obj.y / tileSize;
         var col = obj.x / tileSize;
         var dir = Direction.SOUTH;
         var tempDir = obj.properties.dir;
         if (tempDir) {
            dir = Direction[tempDir.toUpperCase()] || Direction.SOUTH;
         }
         var wanders = true;
         var wanderStr = obj.wanders;
         if (wanderStr) {
            wanders = wanderStr==='true';
         }
         var npc = new Npc({ name: name, type: type, direction: dir,
                             wanders: wanders, mapRow: row, mapCol: col });
         return npc;
      }
   },
   
   _parseTalkAcrossKey: {
      value: function(obj) {
         'use strict';
         var tileSize = this.getTileSize();
         var row = obj.y / tileSize;
         var col = obj.x / tileSize;
         return this._getTalkAcrossKey(row, col);
      }
   },
   
   _getTalkAcrossKey: {
      value: function(row, col) {
         'use strict';
         return row + ',' + col;
      }
   },
   
   toggleShowCollisionLayer: {
      value: function() {
         'use strict';
         var layer = game.map.getLayer('collisionLayer');
         layer.visible = !layer.visible;
         this.setStatusMessage(layer.visible ?
               'Collision layer showing' : 'Collision layer hidden');
      }
   },
   
   toggleShowTerritoryLayer: {
      value: function() {
         'use strict';
         var layer = game.map.getLayer('enemyTerritoryLayer');
         layer.visible = !layer.visible;
         this.setStatusMessage(layer.visible ?
               'Territory layer showing' : 'Territory layer hidden');
      }
   },
   
   getTileSize: {
      value: function() {
         'use strict';
         return 16 * this._scale;
      }
   },
   
   getCollisionLayer: {
      value: function() {
         'use strict';
         return game.map.getLayer('collisionLayer');
      }
   },
   
   bump: {
      value: function() {
         'use strict';
         if (this._gameTime>this._bumpSoundDelay) {
            this.audio.playSound('bump');
            this._bumpSoundDelay = this._gameTime + 300;
         }
      }
   },
   
   setNpcsPaused: {
      value: function(paused) {
         'use strict';
         this.npcsPaused = paused;
      }
   },
   
   stringHeight: {
      value: function() {
         'use strict';
         return this.assets.get('font').cellH;//charHeight();
      }
   },
   
   stringWidth: {
      value: function(str) {
         'use strict';
         return str ? (str.length*this.assets.get('font').cellW) : 0;
      }
   },
   
   drawString: {
      value: function(text, x, y) {
         'use strict';
         this.assets.get('font').drawString(text, x, y);
      }
   },
   
   drawArrow: {
      value: function(x, y) {
         'use strict';
         this.drawString('\u007f', x, y);
      }
   },
   
   startRandomEncounter: {
      value: function() {
         'use strict';
         console.log('Start a random encounter!');
      }
   },
   
   getNpcHeroIsFacing: {
      value: function() {
         'use strict';
         var row = this.hero.mapRow, col = this.hero.mapCol;
         do {
            switch (this.hero.direction) {
               case Direction.NORTH:
                  row--;
                  break;
               case Direction.SOUTH:
                  row++;
                  break;
               case Direction.EAST:
                  col++;
                  break;
               case Direction.WEST:
                  col--;
                  break;
            }
         } while (this.getShouldTalkAcross(row, col));
         for (var i=0; i<this.map.npcs.length; i++) {
            var npc = this.map.npcs[i];
            if (row===npc.mapRow && col===npc.mapCol) {
               return npc;
            }
         }
         return null;
      }
   },
   
   getShouldTalkAcross: {
      value: function(row, col) {
         'use strict';
         return this.map.talkAcrosses[this._getTalkAcrossKey(row, col)];
      }
   }
   
});

DwGame.prototype.constructor = DwGame;
