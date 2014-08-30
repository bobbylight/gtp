var gtp = gtp || {};

gtp.Timer = function() {
   'use strict';
   this._startTimes = [];
   this._prefix = 'DEBUG';
};

gtp.Timer.prototype = {
   
   setLogPrefix: function(prefix) {
      'use strict';
      this._prefix = prefix || 'DEBUG';
   },
   
   start: function(key) {
      'use strict';
      this._startTimes[key] = new Date().getTime();
   },
   
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
   
   endAndLog: function(key) {
      'use strict';
      var time = this.end(key);
      if (time>-1) {
         console.log(this._prefix + ': ' + key + ': ' + time + ' ms');
      }
   }
   
};
