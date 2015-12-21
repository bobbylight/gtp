var gtp;
(function (gtp) {
    'use strict';
    /**
     * This class keeps track of game time.  That includes both total running
     * time, and "active time" (time not spent on paused screens, etc.).
     * @constructor
     */
    var _GameTimer = (function () {
        function _GameTimer() {
            this._paused = false;
            this._pauseStart = 0;
            this._updating = true;
            this._notUpdatingStart = 0;
        }
        Object.defineProperty(_GameTimer.prototype, "paused", {
            /**
             * Returns whether this game is paused.
             * @return {boolean} Whether this game is paused.
             */
            get: function () {
                return this._paused;
            },
            /**
             * Sets whether the game is paused.  The game is still told to handle
             * input, update itself and render.  This is simply a flag that should
             * be set whenever a "pause" screen is displayed.  It stops the "in-game
             * timer" until the game is unpaused.
             *
             * @param paused Whether the game should be paused.
             * @see setUpdating
             */
            set: function (paused) {
                // Cannot pause while !updating, so this is okay
                if (this._paused !== paused) {
                    this._paused = paused;
                    if (paused) {
                        this._pauseStart = gtp.Utils.timestamp();
                    }
                    else {
                        var pauseTime = gtp.Utils.timestamp() - this._pauseStart;
                        this._startShift += pauseTime;
                        this._pauseStart = 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_GameTimer.prototype, "playTime", {
            /**
             * Returns the length of time the game has been played so far.  This is
             * "playable time;" that is, time in which the user is playing, and the
             * game is not paused or in a "not updating" state (such as the main
             * frame not having focus).
             *
             * @return {number} The amount of time the game has been played, in
             *         milliseconds.
             * @see resetPlayTime
             */
            get: function () {
                if (this._pauseStart !== 0) {
                    return this._pauseStart - this._startShift;
                }
                else if (this._notUpdatingStart !== 0) {
                    return this._notUpdatingStart - this._startShift;
                }
                return gtp.Utils.timestamp() - this._startShift;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_GameTimer.prototype, "updating", {
            /**
             * Returns whether this game is updating itself each frame.
             *
             * @return {boolean} Whether this game is updating itself.
             */
            get: function () {
                return this._updating;
            },
            /**
             * Sets whether the game should be "updating" itself.  If a game is not
             * "updating" itself, then it is effectively "paused," and will not accept
             * any input from the user.<p>
             *
             * This method can be used to temporarily "pause" a game when the game
             * window loses focus, for example.
             *
             * @param updating {boolean} Whether the game should be updating itself.
             */
            set: function (updating) {
                if (this._updating !== updating) {
                    this._updating = updating;
                    if (!this.paused) {
                        if (!this._updating) {
                            this._notUpdatingStart = gtp.Utils.timestamp();
                        }
                        else {
                            var notUpdatingTime = gtp.Utils.timestamp() - this._notUpdatingStart;
                            this._startShift += notUpdatingTime;
                            this._notUpdatingStart = 0;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Resets the "playtime in milliseconds" timer back to <code>0</code>.
         *
         * @see playTime
         */
        _GameTimer.prototype.resetPlayTime = function () {
            if (this.paused || !this.updating) {
                throw 'Cannot reset playtime millis when paused or not updating';
            }
            this._startShift = gtp.Utils.timestamp();
        };
        /**
         * Resets this timer.  This should be called when a new game is started.
         */
        _GameTimer.prototype.start = function () {
            this._startShift = gtp.Utils.timestamp();
        };
        return _GameTimer;
    })();
    gtp._GameTimer = _GameTimer;
})(gtp || (gtp = {}));

//# sourceMappingURL=_GameTimer.js.map
