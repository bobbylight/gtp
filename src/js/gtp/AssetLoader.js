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
    * @method
    */
   addJson: function(id, url) {
      
      url = url || id; // allow e.g. "assets.addJson('overworld.json');"
      
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
    * @method
    */
   addImage: function(id, imageSrc) {
      
      var self = this;
      
      var image = new Image();
      this.loadingAssetData[id] = { type: gtp.AssetType.IMAGE };
      console.log('Adding: ' + id + ' => ' + imageSrc +
            ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) +
            ', callback == ' + (this.callback!==null));
      image.addEventListener('load', function() {
         var canvas = gtp.Utils.resize(image, self._scale);
         self._completed(id, canvas);
      });
      
      image.src = imageSrc;
      
   },
   
   /**
    * Starts loading a sound resource.
    * @param id {string} The ID to use when retrieving this resource.
    * @param soundSrc {string} The URL of the resource.
    * @method
    */
   addSound: function(id, soundSrc) {
      
      if (this.audio.isInitialized()) {
         
         var self = this;
         this.loadingAssetData[id] = { type: gtp.AssetType.SOUND };
         
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
   
   addTmxMap: function(map) {
      if (map.tilesets && map.tilesets.length) {
         for (var i=0; i<map.tilesets.length; i++) {
            var tileset = map.tilesets[i];
            var id = '_tilesetImage_' + tileset.name;
            this.addImage(id, tileset.image);
         }
      }
   },
   
   getTmxTilesetImage: function(tileset) {
      return this.responses['_tilesetImage_' + tileset.name];
   },
   
   /**
    * Retrieves a resource by ID.
    * @param res {string} The ID of the resource.
    * @return The resource, or null if not found.
    * @method
    */
   get: function(res) {
      return this.responses[res];
   },
   
   /**
    * Adds a resource.
    * @param res {string} The ID for the resource.
    * @param value {any} The resource value.
    * @method
    */
   set: function(res, value) {
      this.responses[res] = value;
   },
   
   _completed: function(res, response) {
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
   
   isDoneLoading: function() {
      return gtp.Utils.getObjectSize(this.loadingAssetData)===0;
   },
   
   onLoad: function(callback) {
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
