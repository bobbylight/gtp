var gtp = gtp || {};

/**
 * @param {string} id The ID for this sound.
 * @param {number} [loopStart=0] Where to start, in seconds, when this sound
 *        loops (which is typical only when a sound is used for background
 *        music).
 * @constructor
 */
gtp.Sound = function(id, buffer, loopStart) {
   'use strict';
   this._id = id;
   this._buffer = buffer;
   this._loopsByDefault = true;
   this._loopStart = loopStart || 0;
};

gtp.Sound.prototype = {
   
   get buffer() {
      'use strict';
      return this._buffer;
   },
   
   get id() {
      'use strict';
      return this._id;
   },
   
   get loopsByDefaultIfMusic() {
      'use strict';
      return this._loopsByDefault;
   },
   
   set loopsByDefaultIfMusic(loopsByDefault) {
      'use strict';
      this._loopsByDefault = loopsByDefault;
   },
   
   get loopStart() {
      'use strict';
      return this._loopStart;
   },
   
   set loopStart(loopStart) {
      'use strict';
      this._loopStart = loopStart;
   }
   
};
