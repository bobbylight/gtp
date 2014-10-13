var gtp = gtp || {};

/**
 * Obligatory utility methods for games.
 * @constructor
 */
gtp.Utils = function() {
};

/**
 * Returns the number of elements in an object.
 * 
 * @param {object} obj The object.
 * @return {int} The number of elements in the object.
 */
gtp.Utils.getObjectSize = function(obj) {
   'use strict';
   var size = 0;
   for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
         size++;
      }
   }
   return size;
};

/**
 * Adds the properties of one element into another.
 * 
 * @param {object} source The object with properties to mix into another object.
 * @param {object} target The object that will receive the new properties.
 */
gtp.Utils.mixin = function(source, target) {
   'use strict';
   for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
         //if (!target[prop]) {
            target[prop] = source[prop];
         //}
      }
   }
};

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 * 
 * @param {int} min The minimum possible value, inclusive.
 * @param {int} max The maximum possible value, exclusive.
 * @return {int} The random integer value.
 */
gtp.Utils.randomInt = function(min, max) {
   'use strict';
   // Using Math.round() will give you a non-uniform distribution!
   return Math.floor(Math.random() * (max - min)) + min;
};

/** 
 * Defines console functions for IE9 and other braindead browsers.
 */
gtp.Utils.initConsole = function() {
   'use strict';
   if (!window.console) {
      var noOp = function() {};
      window.console = {
         log: noOp,
         warn: noOp,
         error: noOp
      };
   }
};
