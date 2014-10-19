/**
 * @namespace
 */
var gtp = gtp || {};

/**
 * Provides methods to load images, sounds, and Tiled maps.
 * 
 * @param scale How much to scale image resources.
 * @param audio A web audio context.
 * @constructor
 */
gtp.AssetLoader = function(scale, audio) {
   'use strict';
   this._scale = scale || 1;
   this.loadingAssetData = {};
   this.responses = {};
   this.callback = null;
   this.audio = audio;
};

gtp.AssetLoader.prototype = {
   
   /**
    * Starts loading a JSON resource.
    * @param id {string} The ID to use when retrieving this resource.
    * @param url {string} The URL of the resource.
    */
   addJson: function(id, url) {
      'use strict';
      
      url = url || id; // allow e.g. "assets.addJson('overworld.json');"
      
      if (this._isAlreadyTracked(id)) {
         return;
      }
      this.loadingAssetData[id] = { type: gtp.AssetType.JSON };
      console.log('Adding: ' + id + ' => ' + url +
            ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) +
            ', callback == ' + (this.callback!==null));
      
      var that = this;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
         if (xhr.readyState===4) {
            var response = xhr.responseText;
            that._completed(id, response);
         }
      };
      
      xhr.open('GET', url, true);
      xhr.send(null);
   
   },
   
   /**
    * Starts loading an image resource.
    * @param id {string} The ID to use when retrieving this resource.
    * @param imageSrc {string} The URL of the resource.
    */
   addImage: function(id, imageSrc) {
      'use strict';
      
      var self = this;
      
      var image = new Image();
      if (this._isAlreadyTracked(id)) {
         return;
      }
      this.loadingAssetData[id] = { type: gtp.AssetType.IMAGE };
      console.log('Adding: ' + id + ' => ' + imageSrc +
            ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) +
            ', callback == ' + (this.callback!==null));
      image.addEventListener('load', function() {
         var canvas = gtp.ImageUtils.resize(image, self._scale);
         var gtpImage = new gtp.Image(canvas);
         self._completed(id, gtpImage);
      });
      
      image.src = imageSrc;
      
   },
   
   /**
    * Starts loading a sound resource.
    * @param id {string} The ID to use when retrieving this resource.
    * @param soundSrc {string} The URL of the resource.
    */
   addSound: function(id, soundSrc) {
      'use strict';
      
      if (this.audio.isInitialized()) {
         
         if (this._isAlreadyTracked(id)) {
            return;
         }
         this.loadingAssetData[id] = { type: gtp.AssetType.SOUND };
         
         var self = this;
         var xhr = new XMLHttpRequest();
         xhr.onload = function() {
            // TODO: Clean up this API
            self.audio.context.decodeAudioData(xhr.response, function(buffer) {
               self.audio.addSound(id, buffer);
               self._completed(id, buffer);
            });
         };
         
         xhr.open('GET', soundSrc, true);
         xhr.responseType = 'arraybuffer';
         xhr.send(null);
      
      }
      
   },
   
   /**
    * Starts loading a sprite sheet resource.
    * @param id {string} The ID to use when retrieving this resource.
    * @param imageSrc {string} The URL of the resource.
    * @param {int} cellW The width of a cell.
    * @param {int} cellH The height of a cell.
    * @param {int} spacing The spacing between cells.  Assumed to be 0 if
    *        not defined.
    * @param {boolean} firstPixelTranslucent If truthy, the pixel at (0, 0)
    *        is made translucent, along with all other pixels of the same color.
    */
   addSpriteSheet: function(id, imageSrc, cellW, cellH, spacing, firstPixelTranslucent) {
      'use strict';
      
      var self = this;
      spacing = spacing || 0;
      cellW *= self._scale;
      cellH *= self._scale;
      spacing *= self._scale;
      
      var image = new Image();
      if (this._isAlreadyTracked(id)) {
         return;
      }
      this.loadingAssetData[id] = { type: gtp.AssetType.IMAGE };
      console.log('Adding: ' + id + ' => ' + imageSrc +
            ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) +
            ', callback == ' + (this.callback!==null));
      image.addEventListener('load', function() {
         var canvas = gtp.ImageUtils.resize(image, self._scale);
         var gtpImage = new gtp.Image(canvas);
         if (firstPixelTranslucent) {
            gtpImage.makeColorTranslucent(0, 0);
         }
         var ss = new gtp.SpriteSheet(gtpImage, cellW, cellH, spacing);
         self._completed(id, ss);
      });
      
      image.src = imageSrc;
      
   },
   
   /**
    * Registers all images needed by the TMX map's tilesets to this asset
    * loader.
    * 
    * @param {tiled.TiledMap} map The Tiled map.
    */
   addTmxMap: function(map) {
      'use strict';
      if (map.tilesets && map.tilesets.length) {
         for (var i=0; i<map.tilesets.length; i++) {
            var tileset = map.tilesets[i];
            var id = '_tilesetImage_' + tileset.name;
            this.addImage(id, tileset.image);
         }
      }
   },
   
   /**
    * Returns the image corresponding to a Tiled tileset.  This method is
    * called by the library and is typically not called directly by the
    * application.
    * 
    * @param {tiled.TiledTileset} tileset The tile set.
    * @return The canvas.
    */
   getTmxTilesetImage: function(tileset) {
      'use strict';
      return this.responses['_tilesetImage_' + tileset.name];
   },
   
   /**
    * Retrieves a resource by ID.
    * @param res {string} The ID of the resource.
    * @return The resource, or null if not found.
    */
   get: function(res) {
      'use strict';
      return this.responses[res];
   },
   
   _isAlreadyTracked: function(id) {
      'use strict';
      if (this.loadingAssetData[id]) {
         console.log('A resource with id ' + id + ' is already loading.  Assuming they are the same');
         return true;
      }
      else if (this.responses[id]) {
         console.log('A resource with id ' + id + ' has already been loaded.');
         return true;
      }
   },
   
   /**
    * Adds a resource.
    * @param res {string} The ID for the resource.
    * @param value {any} The resource value.
    */
   set: function(res, value) {
      'use strict';
      this.responses[res] = value;
   },
   
   _completed: function(res, response) {
      'use strict';
      if (!this.loadingAssetData[res]) {
         console.error('Resource not found! - ' + res);
         return;
      }
      if (this.loadingAssetData[res].type === gtp.AssetType.JSON) {
         response = JSON.parse(response);
      }
      this.responses[res] = response;
      delete this.loadingAssetData[res];
      console.log('Completed: ' + res + ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) + ', callback == ' + (this.callback!==null));
      if (this.isDoneLoading() && this.callback) {
         this.callback.call();
         delete this.callback;
         console.log('... Callback called and deleted (callback == ' + (this.callback!==null) + ')');
         if (this.nextCallback) {
            this.callback = this.nextCallback;
            delete this.nextCallback;//this.nextCallback = null;
         }
      }
      else {
         console.log('... Not running callback - ' + this.isDoneLoading() + ', ' + (this.callback!==null));
      }
   },
   
   /**
    * Returns whether all assets in thie loader have successfully loaded.
    * 
    * @return {boolean} Whether all assets have loaded.
    */
   isDoneLoading: function() {
      'use strict';
      return gtp.Utils.getObjectSize(this.loadingAssetData)===0;
   },
   
   onLoad: function(callback) {
      'use strict';
      if (this.isDoneLoading()) {
         callback.call();
      }
      else if (this.callback) { // A new callback added from another callback
         this.nextCallback = callback;
      }
      else {
         this.callback = callback;
      }
   }

};
