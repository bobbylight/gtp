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
   for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
         if (!target[prop]) {
            target[prop] = source[prop];
         }
      }
   }
};

/** 
 * Defines console functions for IE9 and other braindead browsers.
 */
gtp.Utils.initConsole = function() {
   if (!window.console) {
      var noOp = function() {};
      window.console = {
         log: noOp,
         warn: noOp,
         error: noOp
      };
   }
};
