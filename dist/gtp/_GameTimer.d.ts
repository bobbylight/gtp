declare module gtp {
    /**
     * This class keeps track of game time.  That includes both total running
     * time, and "active time" (time not spent on paused screens, etc.).
     * @constructor
     */
    class _GameTimer {
        private _startShift;
        private _paused;
        private _pauseStart;
        private _updating;
        private _notUpdatingStart;
        constructor();
        private _getMillis();
        /**
         * Returns whether this game is paused.
         * @return {boolean} Whether this game is paused.
         */
        /**
         * Sets whether the game is paused.  The game is still told to handle
         * input, update itself and render.  This is simply a flag that should
         * be set whenever a "pause" screen is displayed.  It stops the "in-game
         * timer" until the game is unpaused.
         *
         * @param paused Whether the game should be paused.
         * @see setUpdating
         */
        paused: boolean;
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
        playTime: number;
        /**
         * Returns whether this game is updating itself each frame.
         *
         * @return {boolean} Whether this game is updating itself.
         */
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
        updating: boolean;
        /**
         * Resets the "playtime in milliseconds" timer back to <code>0</code>.
         *
         * @see playTime
         */
        resetPlayTime(): void;
        /**
         * Resets this timer.  This should be called when a new game is started.
         */
        start(): void;
    }
}
