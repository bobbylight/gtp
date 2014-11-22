var gtp = gtp || {};

/**
 * A way to keep track of a delay.  Useful when you want some event to occur
 * every X milliseconds, for example.
 * 
 * @param {object} args Arguments to this delay.
 * @param {number-or-array} args.millis The number of milliseconds between
 *        events.  You can specify an array of numbers to have the even trigger
 *        at non-equal intervals.
 * @param {int} [args.minDelta] If specified, a minimum amount of variance for
 *        the event.  May be negative, but should be larger than the smallest
 *        value specified in millis.
 * @param {int} [args.maxDelta] If specified, a maximum amount of variance for
 *        the event.
 * @param {function} [args.callback] If specified, a callback function that
 *        will be called when this delay fires.
 * @constructor
 */
// TODO: Add property to auto-repeat, possibly run callback on ticks
gtp.Delay = function(args) {
   'use strict';
   if (!args || !args.millis) {
      throw 'Missing required "millis" argument to gtp.Delay';
   }
   this._initial = args.millis.length ? args.millis : [ args.millis ];
   this._initialIndex = 0;
   if (args.minDelta && args.maxDelta) {
      this.setRandomDelta(args.minDelta, args.maxDelta);
   }
   this._callback = args.callback;
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
         if (this._remaining <= 0 && this._callback) {
            this._callback(this);
         }
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
   },
   
   toString: function() {
      'use strict';
      return '[gtp.Delay: _initial=' + this._initial +
            ', _remaining=' + this._remaining +
            ', _callback=' + (this._callback != null) +
            ']';
   }
   
};
