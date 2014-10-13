var gtp = gtp || {};

// TODO: Add property to auto-repeat, possibly run callback on ticks
gtp.Delay = function(millis, minDelta, maxDelta) {
   'use strict';
   this._initial = millis;
   if (minDelta && maxDelta) {
      this.setRandomDelta(minDelta, maxDelta);
   }
   this.reset();
};

gtp.Delay.prototype = {
   
   update: function(delta) {
      'use strict';
      if (this._remaining > 0) {
         this._remaining -= delta;
      }
      return this.isDone();
   },
   
   isDone: function() {
      'use strict';
      return this._remaining <= 0;
   },
   
   /**
    * Causes this delay to trigger with a little random variance.
    * 
    * @param {int} min The minimum possible variance, inclusive.
    * @param {int} max The maximum possible variance, exclusive.
    */
   setRandomDelta: function(min, max) {
      'use strict';
      this._minDelta = min;
      this._maxDelta = max;
   },
   
   reset: function() {
      'use strict';
      this._remaining = this._initial;
      if (this._minDelta!==0 || this._maxDelta!==0) {
         this._remaining += gtp.Utils.randomInt(this._minDelta, this._maxDelta);
      }
      console.log('New remaining: ' + this._remaining);
   }
};
