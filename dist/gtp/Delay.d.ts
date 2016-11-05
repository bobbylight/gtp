declare module gtp {
    /**
     * Arguments to the Delay constructor.
     */
    interface DelayArgs {
        millis: any;
        minDelta?: number;
        maxDelta?: number;
        callback?: Function;
        loop?: boolean;
        loopCount?: number;
    }
    /**
     * A way to keep track of a delay.  Useful when you want some event to occur
     * every X milliseconds, for example.
     *
     * @param {object} args Arguments to this delay.
     * @param {number-or-array} args.millis The number of milliseconds between
     *        events.  You can specify an array of numbers to have the even trigger
     *        at non-equal intervals.
     * @param {int} [args.minDelta] If specified, a minimum amount of variance for
     *        the event.  May be negative, but should be larger than the smallest
     *        value specified in millis.
     * @param {int} [args.maxDelta] If specified, a maximum amount of variance for
     *        the event.
     * @param {int} [args.loop] If specified and <code>true</code>, this timer will
     *        automatically repeat and <code>isDone()</code> will never return
     *        <code>true</code>.
     * @param {int} [args.loopCount] This argument is only honored if
     *        <code>args.loop</code> is defined and <code>true</code>.  If true,
     *        this argument is the number of times to loop; if this argument is not
     *        specified, looping will occur indefinitely.
     * @param {function} [args.callback] If specified, a callback function that
     *        will be called when this delay fires.
     * @constructor
     */
    class Delay {
        _initial: number[];
        _initialIndex: number;
        _callback: Function | undefined;
        _loop: boolean;
        _loopCount: number;
        _maxLoopCount: number;
        _minDelta: number;
        _maxDelta: number;
        _remaining: number;
        _curInitial: number;
        constructor(args: DelayArgs);
        /**
         * Should be called in the update() method of the current game state to
         * update this Delay.
         *
         * @param {int} delta The time that has elapsed since the last call to this
         *        method.
         */
        update(delta: number): boolean;
        /**
         * Returns the number of times this Delay has looped.
         *
         * @return {int} The number of times this Delay has looped.
         */
        getLoopCount(): number;
        /**
         * Returns the maximum delta value, or -1 if none was defined.
         *
         * @return {int} The maximum delta value.
         * @see getMinDelta()
         */
        getMaxDelta(): number;
        /**
         * Returns the minimum delta value, or -1 if none was defined.
         *
         * @return {int} The minimum delta value.
         * @see getMaxDelta()
         */
        getMinDelta(): number;
        /**
         * Returns the remaining time on this delay.
         *
         * @return {int} The remaining time on this delay.
         */
        getRemaining(): number;
        /**
         * Returns how far along we are in this delay, in the range
         * 0 - 1.
         *
         * @return {int} How far along we are in this delay.
         */
        getRemainingPercent(): number;
        /**
         * Returns whether this Delay has completed.
         *
         * @return {boolean} Whether this Delay has completed.
         */
        isDone(): boolean;
        /**
         * Causes this delay to trigger with a little random variance.
         *
         * @param {int} min The minimum possible variance, inclusive.
         * @param {int} max The maximum possible variance, exclusive.
         */
        setRandomDelta(min: number, max: number): void;
        reset(smooth?: boolean): void;
        toString(): string;
    }
}
