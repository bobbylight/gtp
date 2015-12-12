declare module gtp {
    class Timer {
        private _startTimes;
        private _prefix;
        /**
         * Allows you to time actions and log their runtimes to the console.
         * @constructor
         */
        constructor();
        /**
         * Sets the prefix to prepend to each line printed to the console.
         *
         * @param {String} prefix The new prefix.  'DEBUG' is used if not defined.
         */
        setLogPrefix(prefix?: string): void;
        /**
         * Starts timing something.
         *
         * @param {String} key A unique key for the thing being timed.
         */
        start(key: string): void;
        /**
         * Stops timing something.
         *
         * @param {String} key The key of the thing being timed.
         */
        end(key: string): number;
        /**
         * Stops timing something and logs its runtime to the console.
         *
         * @param {String} key The key of the thing being timed.
         */
        endAndLog(key: string): void;
    }
}
