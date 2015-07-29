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
 * @param {int} [args.loop] If specified and <code>true</code>, this timer will
 *        automatically repeat and <code>isDone()</code> will never return
 *        <code>true</code>.
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
   this._loop = !!args.loop;
   this._loopCount = 0;
   this._maxLoopCount = args.loopCount || -1;
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
         this._remaining = Math.max(this._remaining - delta, 0);
         if (this._remaining <= 0 && this._callback) {
            this._callback(this);
         }
      }
      if (this._loop && this._remaining <= 0) {
         if (this._maxLoopCount === -1 || this._loopCount < this._maxLoopCount-1) {
            this._loopCount++;
            this.reset(true);
         }
         else {
            this._loopCount = this._maxLoopCount;
            this._remaining = -1;
         }
      }
      return this.isDone();
   },
   
   /**
    * Returns the number of times this Delay has looped.
    *
    * @return {int} The number of times this Delay has looped.
    */
   getLoopCount: function() {
      'use strict';
      return this._loopCount;
   },
   
   /**
    * Returns the remaining time on this delay.
    *
    * @return {boolean} The remaining time on this delay.
    */
   getRemaining: function() {
      'use strict';
      return this._remaining;
   },
   
   /**
    * Returns how far along we are in this delay, in the range
    * 0 - 1.
    *
    * @return {int} How far along we are in this delay.
    */
   getRemainingPercent: function() {
      'use strict';
      return this._remaining / this._curInitial;
   },
   
   /**
    * Returns whether this Delay has completed.
    * 
    * @return {boolean} Whether this Delay has completed.
    */
   isDone: function() {
      'use strict';
      return (!this._loop || this._loopCount === this._maxLoopCount) &&
            this._remaining <= 0;
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
   
   /**
    * Resets this delay.  This can be called after <code>isDone()</code>
    * returns <code>true</code> to start a timer again.
    *
    * @param {int} [smooth] If <code>true</code>, any time this timer went
    *        "over" in the previous iteration is counted towards the next
    *        iteration.  The default value is <code>false</code>
    */
   reset: function(smooth) {
      'use strict';
      smooth = !!smooth;
      var prevRemaining = this._remaining;
      this._curInitial = this._remaining = this._initial[this._initialIndex];
      if (smooth && prevRemaining < 0) {
         this._remaining += prevRemaining; // Subtract how much we went over
      }
      this._initialIndex = (this._initialIndex + 1) % this._initial.length;
      if (this._minDelta || this._maxDelta) {
         this._remaining += gtp.Utils.randomInt(this._minDelta, this._maxDelta);
      }
   },
   
   toString: function() {
      'use strict';
      return '[gtp.Delay: _initial=' + this._initial +
            ', _remaining=' + this._remaining +
            ', _loop=' + this._loop +
            ', _callback=' + (this._callback != null) +
            ']';
   }
   
};
