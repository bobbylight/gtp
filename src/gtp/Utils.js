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
 * Returns the value of a request parameter.
 * 
 * @param {string} param The name of the request parameter.
 * @return {string} The value of the request parameter, or <code>null</code>
 *         if it was not specified.
 */
gtp.Utils.getRequestParam = function(param) {
   'use strict';
   var searchFor = param;
   var params = window.location.search.substring(1);
   var equals, end;
   if (params.indexOf(searchFor)===0) {
      equals = params.indexOf('=');
      if (equals === -1) {
         return '';
      }
      equals++;
      end = Math.max(params.indexOf('&', equals), params.length);
      return params.substring(equals, end);
   }
   searchFor = '&' + searchFor;
   var index = params.indexOf(searchFor);
   if (index >= -1) {
      var start = index + searchFor.length;
      if (params.charAt(start) === '=') {
         start++;
         end = Math.max(params.indexOf('&', start), params.length);
         return params.substring(start, end);
      }
      else if (start===params.length) {
         return '';
      }
   }
   return null;
};

/**
 * Equivlaent to dojo/_base/hitch, returns a function in a specific scope.
 * 
 * @param {object} scope The scope to run the function in (e.g. the value of
 *        "this").
 * @param {function} func The function.
 * @return {function} A function that does the same thing as 'func', but in the
 *         specified scope.
 */
gtp.Utils.hitch = function(scope, func) {
   'use strict';
   return function() {
      func.apply(scope, arguments);
   };
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
