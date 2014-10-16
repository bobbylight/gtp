var gtp = gtp || {};

/**
 * A wrapper around web audio for games.
 * 
 * @constructor
 */
gtp.AudioSystem = function() {
   'use strict';
   this._currentMusic = null;
   this._soundBuffers = {};
   this._musicFade = 0.3; // seconds
   this._fadeMusic = true;
};

gtp.AudioSystem.prototype = {
   
   /**
    * Initializes the audio system.
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
    */
   isInitialized: function() {
      'use strict';
      return this._initialized;
   },
   
   fadeOutMusic: function(newMusicId) {
      'use strict';
      
      if (this.context) {
         if (this._currentMusic) {
            // We must "anchor" via setValueAtTime() before calling a *rampToValue() method (???)
            this._faderGain.gain.setValueAtTime(this._faderGain.gain.value, this.context.currentTime);
            this._faderGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this._musicFade);
            var that = this;
            setTimeout(function() {
               that.playMusic(newMusicId);
            }, this._musicFade * 1000);
         }
         else {
            this.playMusic(newMusicId);
         }
      }
   },
   
   /**
    * Plays a specific sound as background music.  Only one "music" can play
    * at a time, as opposed to "sounds," of which multiple can be playing at
    * one time.
    * @param {string} id The ID of the resource to play as music.
    */
   playMusic: function(id) {
      'use strict';
      if (this.context) {
         if (this._currentMusic) {
            this._currentMusic.stop();
            this._currentMusic.disconnect();
            delete this._currentMusic;
            this._faderGain.disconnect();
            delete this._faderGain;
         }
         this._faderGain = this.context.createGain();
         this._faderGain.gain.setValueAtTime(1, this.context.currentTime);
         this._faderGain.gain.value = 1;
         this._currentMusic = this.context.createBufferSource();
         this._currentMusic.buffer = this._soundBuffers[id];
         this._currentMusic.loop = true;
         this._currentMusic.connect(this._faderGain);
         this._faderGain.connect(this.context.destination);
         this._currentMusic.start(0);
         console.log('Just started new music with id: ' + id);
      }
   },
   
   /**
    * Plays the sound with the given ID.
    * @param {string} id The ID of the resource to play.
    */
   playSound: function(id) {
      'use strict';
      if (this.context) {
         var source = this.context.createBufferSource();
         source.buffer = this._soundBuffers[id];
         source.connect(this.context.destination);
         source.start(0);
      }
   },
   
   get fadeMusic() {
      'use strict';
      return this._fadeMusic;
   },
   
   set fadeMusic(fade) {
      'use strict';
      this._fadeMusic = fade || false;
   },
   
   get musicFadeSeconds() {
      'use strict';
      return this._musicFade;
   },
   
   set musicFadeSeconds(seconds) {
      'use strict';
      this._musicFade = seconds;
   }
   
};
