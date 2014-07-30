var gtp = gtp || {};

gtp.Timer = function() {
   this._startTimes = [];
   this._prefix = 'DEBUG';
};

gtp.Timer.prototype = {
   
   setLogPrefix: function(prefix) {
      this._prefix = prefix || 'DEBUG';
   },
   
   start: function(key) {
      this._startTimes[key] = new Date().getTime();
   },
   
   end: function(key) {
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
      var time = this.end(key);
      if (time>-1) {
         console.log(this._prefix + ': ' + key + ': ' + time + ' ms');
      }
   }
   
};
