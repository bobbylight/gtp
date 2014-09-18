var gtp = gtp || {};

// TODO: Add property to auto-repeat, possibly run callback on ticks
gtp.Delay = function(millis) {
   'use strict';
   this._initial = millis;
   this.reset();
}

gtp.Delay.prototype = {
   
   update: function(delta) {
      if (this._remaining > 0) {
         this._remaining -= delta;
      }
      return this.isDone();
   },
   
   isDone: function() {
      return this._remaining <= 0;
   },
   
   reset: function() {
      this._remaining = this._initial;
   }
};
