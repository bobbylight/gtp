var gtp;
(function (gtp) {
    'use strict';
    var Timer = (function () {
        /**
         * Allows you to time actions and log their runtimes to the console.
         * @constructor
         */
        function Timer() {
            this._startTimes = {};
            this._prefix = 'DEBUG';
        }
        /**
         * Sets the prefix to prepend to each line printed to the console.
         *
         * @param {String} prefix The new prefix.  'DEBUG' is used if not defined.
         */
        Timer.prototype.setLogPrefix = function (prefix) {
            if (prefix === void 0) { prefix = 'DEBUG'; }
            this._prefix = prefix;
        };
        /**
         * Starts timing something.
         *
         * @param {String} key A unique key for the thing being timed.
         */
        Timer.prototype.start = function (key) {
            this._startTimes[key] = new Date().getTime();
        };
        /**
         * Stops timing something.
         *
         * @param {String} key The key of the thing being timed.
         */
        Timer.prototype.end = function (key) {
            var start = this._startTimes[key];
            if (!start) {
                console.error('Cannot end timer for "' + key + '" as it was never started');
                return -1;
            }
            var time = new Date().getTime() - start;
            delete this._startTimes[key];
            return time;
        };
        /**
         * Stops timing something and logs its runtime to the console.
         *
         * @param {String} key The key of the thing being timed.
         */
        Timer.prototype.endAndLog = function (key) {
            var time = this.end(key);
            if (time > -1) {
                console.log(this._prefix + ': ' + key + ': ' + time + ' ms');
            }
        };
        return Timer;
    })();
    gtp.Timer = Timer;
})(gtp || (gtp = {}));

//# sourceMappingURL=Timer.js.map
