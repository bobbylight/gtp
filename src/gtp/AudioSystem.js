var gtp = gtp || {};

/**
 * A wrapper around web audio for games.
 * 
 * @constructor
 */
gtp.AudioSystem = function() {
   'use strict';
   this._currentMusic = null;
   this._sounds = {};
   this._musicFade = 0.3; // seconds
   this._fadeMusic = true;
   this._muted = false;
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
         this._volumeFaderGain = this.context.createGain();
         this._volumeFaderGain.gain.setValueAtTime(1, this.context.currentTime);
         this._volumeFaderGain.gain.value = 1;
         this._volumeFaderGain.connect(this.context.destination);
         this._initialized = true;
      } catch (e) {
         console.error('The Web Audio API is not supported in this browser.');
         this._initialized = false;
      }
   },
   
   /**
    * Registers a sound for later playback.
    * @param sound {gtp.Sound} The sound.
    */
   addSound: function(sound) {
      'use strict';
      if (this.context) {
         this._sounds[sound.id] = sound;
      }
   },
   
   fadeOutMusic: function(newMusicId) {
      'use strict';
      
      if (this.context) {
         if (this._currentMusic) {
            if (!this._muted) {
               // We must "anchor" via setValueAtTime() before calling a *rampToValue() method (???)
               this._musicFaderGain.gain.setValueAtTime(this._musicFaderGain.gain.value, this.context.currentTime);
               this._musicFaderGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this._musicFade);
            }
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
    * Returns the ID of the current music being played.
    * 
    * @return {string} The current music's ID.
    */
   getCurrentMusic: function() {
      'use strict';
      return this.currentMusicId;
   },
   
   /**
    * Returns whether the audio system initialized properly.  This will return
    * false if the user's browser does not support the web audio API.
    * @param id {string} The ID to use when retrieving this resource.
    * @param url {string} The URL of the resource.
    * @return {boolean} Whether the sound system is initialized
    */
   isInitialized: function() {
      'use strict';
      return this._initialized;
   },
   
   /**
    * Plays a specific sound as background music.  Only one "music" can play
    * at a time, as opposed to "sounds," of which multiple can be playing at
    * one time.
    * @param {string} id The ID of the resource to play as music.
    * @param {boolean} loop Whether the music should loop.
    */
   playMusic: function(id, loop) {
      'use strict';
      
      if (this.context) {
         
         var sound = this._sounds[id];
         if (typeof loop === 'undefined') {
            loop = sound.loopsByDefaultIfMusic;
         }
         
         // Note: We destroy and recreate _musicFaderGain each time, because
         // it appears to occasionally start playing muted if we do not do
         // so, even when gain.value===1, on Chrome 38.
         if (this._currentMusic) {
            this._currentMusic.stop();
            this._currentMusic.disconnect();
            delete this._currentMusic;
            this._musicFaderGain.disconnect();
            delete this._musicFaderGain;
         }
         this._musicFaderGain = this.context.createGain();
         this._musicFaderGain.gain.setValueAtTime(1, this.context.currentTime);
         this._musicFaderGain.gain.value = 1;
         this._currentMusic = this.context.createBufferSource();
         this._currentMusic.loop = loop;
         this._musicLoopStart = sound.loopStart || 0;
         this._currentMusic.loopStart = this._musicLoopStart;
         this._currentMusic.buffer = sound.buffer;
         this._currentMusic.loopEnd = this._currentMusic.buffer.duration;
         this._currentMusic.connect(this._musicFaderGain);
         this._musicFaderGain.connect(this._volumeFaderGain);
         this._currentMusic.start(0);
         this.currentMusicId = id;
         console.log('Just started new music with id: ' + id + ', loop: ' + loop);
         
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
         source.buffer = this._sounds[id].buffer;
         source.connect(this._volumeFaderGain);
         source.start(0);
      }
   },
   
   toggleMuted: function() {
      'use strict';
      this._muted = !this._muted;
      if (this.context) {
         var initialValue = this._muted ? 0 : 1;
         this._volumeFaderGain.gain.setValueAtTime(initialValue, this.context.currentTime);
         this._volumeFaderGain.gain.value = initialValue;
      }
      return this._muted;
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
