var gtp = gtp || {};

/**
 * A way to keep track of a delay.  Useful when you want some event to occur
 * every X milliseconds, for example.
 * 
 * @param {number-or-array} millis The number of milliseconds between events.
 *        You can specify an array of numbers to have the even trigger at
 *        non-equal intervals.
 * @param {int} [minDelta] If specified, a minimum amount of variance for the
 *        event.  May be negative, but should be larger than the smallest value
 *        specified in millis.
 * @param {int} [maxDelta] If specified, a maximum amount of variance for the
 *        event.
 * @constructor
 */
// TODO: Add property to auto-repeat, possibly run callback on ticks
gtp.Delay = function(millis, minDelta, maxDelta) {
   'use strict';
   this._initial = millis.length ? millis : [ millis ];
   this._initialIndex = 0;
   if (minDelta && maxDelta) {
      this.setRandomDelta(minDelta, maxDelta);
   }
   this.reset();
};

gtp.Delay.prototype = {
   
   /**
    * Should be called in the update() method of the current game state to
    * update this Delay.
    * 
    * @param {int} delta The time that has elapsed since the last call to this
    *        method.
    */
   update: function(delta) {
      'use strict';
      if (this._remaining > 0) {
         this._remaining -= delta;
      }
      return this.isDone();
   },
   
   /**
    * Returns whether this Delay has completed.
    * 
    * @return {boolean} Whether this Delay has completed.
    */
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
      this._remaining = this._initial[this._initialIndex];
      this._initialIndex = (this._initialIndex + 1) % this._initial.length;
      if (this._minDelta || this._maxDelta) {
         this._remaining += gtp.Utils.randomInt(this._minDelta, this._maxDelta);
      }
   }
};
