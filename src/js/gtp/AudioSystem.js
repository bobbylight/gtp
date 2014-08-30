var gtp = gtp || {};

/**
 * A wrapper around web audio for games.
 * 
 * @constructor
 */
gtp.AudioSystem = function() {
   'use strict';
   this._soundBuffers = {};
};

gtp.AudioSystem.prototype = {
   
   /**
    * Initializes the audio system.
    * @method
    */
   init: function() {
      'use strict';
      try {
         window.AudioContext = window.AudioContext || window.webkitAudioContext;
         this.context = new window.AudioContext();
         this._initialized = true;
      } catch (e) {
         console.error('The Web Audio API is not supported in this browser.');
         this._initialized = false;
      }
   },
   
   /**
    * Registers a sound for later playback.
    * @param id {string} The ID to use when retrieving this sound.
    * @param buffer {object} The sound data.
    * @method
    */
   addSound: function(id, buffer) {
      'use strict';
      if (this.context) {
         this._soundBuffers[id] = buffer;
      }
   },
   
   /**
    * Starts loading a JSON resource.
    * @param id {string} The ID to use when retrieving this resource.
    * @param url {string} The URL of the resource.
    * @return {boolean} Whether the sound system is initialized
    * @method
    */
   isInitialized: function() {
      'use strict';
      return this._initialized;
   },
   
   /**
    * Plays the sound with the given ID.
    * @param id {string} The ID to use when retrieving this resource.
    * @method
    */
   playSound: function(id) {
      'use strict';
      if (this.context) {
         var source = this.context.createBufferSource();
         source.buffer = this._soundBuffers[id];
         source.connect(this.context.destination);
         source.start(0);
      }
   }
   
};
