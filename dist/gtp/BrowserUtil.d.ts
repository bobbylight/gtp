declare module gtp {
    /**
     * Utility methods for interfacing with browser APIs.  This stuff is
     * typically hard to unit test, and thus is in this class so it is easily
     * mockable.
     *
     * @constructor
     */
    class BrowserUtil {
        /**
         * Returns <code>window.location.search</code>.
         */
        static getWindowLocationSearch(): string;
    }
}
