var gtp = window.gtp || {};

/**
 * Utility methods for interfacing with browser APIs.  This stuff is
 * typically hard to unit test, and thus is in this class so it is easily
 * mockable.
 * 
 * @constructor
 */
gtp.BrowserUtil = function() {
};

/**
 * Returns <code>window.location.search</code>.
 */
gtp.BrowserUtil.getWindowLocationSearch = function() {
   'use strict';
   return window.location.search;
};
