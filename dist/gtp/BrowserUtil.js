var gtp;
(function (gtp) {
    'use strict';
    /**
     * Utility methods for interfacing with browser APIs.  This stuff is
     * typically hard to unit test, and thus is in this class so it is easily
     * mockable.
     *
     * @constructor
     */
    var BrowserUtil = (function () {
        function BrowserUtil() {
        }
        /**
         * Returns <code>window.location.search</code>.
         */
        BrowserUtil.getWindowLocationSearch = function () {
            return window.location.search;
        };
        return BrowserUtil;
    })();
    gtp.BrowserUtil = BrowserUtil;
})(gtp || (gtp = {}));

//# sourceMappingURL=BrowserUtil.js.map
