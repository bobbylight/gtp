var gtp = gtp || {};

/**
 * Allows you to time actions and log their runtimes to the console.
 * @constructor
 */
gtp.Timer = function() {
   'use strict';
   this._startTimes = [];
   this._prefix = 'DEBUG';
};

gtp.Timer.prototype = {
   
   /**
    * Sets the prefix to prepend to each line printed to the console.
    * 
    * @param {String} prefix The new prefix.  'DEBUG' is used if not defined.
    */
   setLogPrefix: function(prefix) {
      'use strict';
      this._prefix = prefix || 'DEBUG';
   },
   
   /**
    * Starts timing something.
    * 
    * @param {String} key A unique key for the thing being timed.
    */
   start: function(key) {
      'use strict';
      this._startTimes[key] = new Date().getTime();
   },
   
   /**
    * Stops timing something.
    * 
    * @param {String} key The key of the thing being timed.
    */
   end: function(key) {
      'use strict';
      var start = this._startTimes[key];
      if (!start) {
         console.error('Cannot end timer for "' + key + '" as it was never started');
         return -1;
      }
      var time = new Date().getTime() - start;
      delete this._startTimes[key];
      return time;
   },
   
   /**
    * Stops timing something and logs its runtime to the console.
    * 
    * @param {String} key The key of the thing being timed.
    */
   endAndLog: function(key) {
      'use strict';
      var time = this.end(key);
      if (time>-1) {
         console.log(this._prefix + ': ' + key + ': ' + time + ' ms');
      }
   }
   
};
