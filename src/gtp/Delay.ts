/**
 * Arguments to the Delay constructor.
 */
export interface DelayArgs {
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
export class Delay {

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

	constructor(args: DelayArgs) {
		if (!args || !args.millis) {
			throw 'Missing required "millis" argument to Delay';
		}
		this._initial = args.millis.length ? args.millis : [args.millis];
		this._initialIndex = 0;
		if (args.minDelta && args.maxDelta) {
			this.setRandomDelta(args.minDelta, args.maxDelta);
		}
		this._callback = args.callback;
		this._loop = !!args.loop;
		this._loopCount = 0;
		this._maxLoopCount = this._loop ? (args.loopCount || -1) : -1;
		this.reset();
	}

	/**
	 * Should be called in the update() method of the current game state to
	 * update this Delay.
	 *
	 * @param {int} delta The time that has elapsed since the last call to this
	 *        method.
	 */
	update(delta: number) {
		if (this._remaining > 0) {
			this._remaining -= delta;
			if (this._remaining <= 0 && this._callback) {
				this._callback(this);
			}
		}
		if (this._remaining <= 0) {
			if (this._loop) {
				if (this._maxLoopCount === -1 || this._loopCount < this._maxLoopCount - 1) {
					this._loopCount++;
					this.reset(true);
				}
				else {
					this._loopCount = this._maxLoopCount;
					this._remaining = -1;
				}
			}
			else {
				this._remaining = Math.max(0, this._remaining);
			}
		}
		return this.isDone();
	}

	/**
	 * Returns the number of times this Delay has looped.
	 *
	 * @return {int} The number of times this Delay has looped.
	 */
	getLoopCount(): number {
		return this._loopCount;
	}

	/**
	 * Returns the maximum delta value, or -1 if none was defined.
	 *
	 * @return {int} The maximum delta value.
	 * @see getMinDelta()
	 */
	getMaxDelta(): number {
		return typeof this._maxDelta !== 'undefined' ? this._maxDelta : -1;
	}

	/**
	 * Returns the minimum delta value, or -1 if none was defined.
	 *
	 * @return {int} The minimum delta value.
	 * @see getMaxDelta()
	 */
	getMinDelta(): number {
		return typeof this._minDelta !== 'undefined' ? this._minDelta : -1;
	}

	/**
	 * Returns the remaining time on this delay.
	 *
	 * @return {int} The remaining time on this delay.
	 */
	getRemaining(): number {
		return this._remaining;
	}

	/**
	 * Returns how far along we are in this delay, in the range
	 * 0 - 1.
	 *
	 * @return {int} How far along we are in this delay.
	 */
	getRemainingPercent(): number {
		return this._remaining / this._curInitial;
	}

	/**
	 * Returns whether this Delay has completed.
	 *
	 * @return {boolean} Whether this Delay has completed.
	 */
	isDone(): boolean {
		return (!this._loop || this._loopCount === this._maxLoopCount) &&
			this._remaining <= 0;
	}

	/**
	 * Causes this delay to trigger with a little random variance.
	 *
	 * @param {int} min The minimum possible variance, inclusive.
	 * @param {int} max The maximum possible variance, exclusive.
	 */
	setRandomDelta(min: number, max: number) {
		this._minDelta = min;
		this._maxDelta = max;
	}

	reset(smooth?: boolean) {
		smooth = !!smooth;
		const prevRemaining: number = this._remaining;
		this._curInitial = this._remaining = this._initial[this._initialIndex];
		if (smooth && prevRemaining < 0) {
			this._remaining += prevRemaining; // Subtract how much we went over
		}
		this._initialIndex = (this._initialIndex + 1) % this._initial.length;
		if (this._minDelta || this._maxDelta) {
			//				this._remaining += Utils.randomInt(this._minDelta, this._maxDelta);
		}
	}

	toString() {
		return '[Delay: _initial=' + this._initial +
			', _remaining=' + this._remaining +
			', _loop=' + this._loop +
			', _callback=' + (this._callback != null) +
			']';
	}

}
