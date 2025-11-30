export type DelayCallback = (delay: Delay) => void;

/**
 * Arguments to the Delay constructor.
 */
export interface DelayArgs {
	millis: number | number[];
	minDelta?: number;
	maxDelta?: number;
	callback?: DelayCallback;
	loop?: boolean;
	loopCount?: number;
}

/**
 * A way to keep track of a delay.  Useful when you want some event to occur
 * every X milliseconds, for example.
 *
 * @param args Arguments to this delay.
 * @param args.millis The number of milliseconds between
 *        events.  You can specify an array of numbers to have the even trigger
 *        at non-equal intervals.
 * @param [args.minDelta] If specified, a minimum amount of variance for
 *        the event.  May be negative, but should be larger than the smallest
 *        value specified in millis.
 * @param [args.maxDelta] If specified, a maximum amount of variance for
 *        the event.
 * @param [args.loop] If specified and <code>true</code>, this timer will
 *        automatically repeat and <code>isDone()</code> will never return
 *        <code>true</code>.
 * @param [args.loopCount] This argument is only honored if
 *        <code>args.loop</code> is defined and <code>true</code>.  If true,
 *        this argument is the number of times to loop; if this argument is not
 *        specified, looping will occur indefinitely.
 * @param [args.callback] If specified, a callback function that
 *        will be called when this delay fires.
 */
export default class Delay {

	private readonly initial: number[];
	private initialIndex: number;
	private readonly callback: DelayCallback | undefined;
	private readonly loop: boolean;
	private loopCount: number;
	private readonly maxLoopCount: number;
	private minDelta?: number;
	private maxDelta?: number;
	private remaining: number;
	private curInitial: number;

	constructor(args: DelayArgs) {
		if (!args?.millis) {
			throw new Error('Missing required "millis" argument to Delay');
		}
		this.initial = Array.isArray(args.millis) ? args.millis : [ args.millis ];
		this.initialIndex = 0;
		if (args.minDelta && args.maxDelta) {
			this.setRandomDelta(args.minDelta, args.maxDelta);
		}
		this.callback = args.callback;
		this.loop = !!args.loop;
		this.loopCount = 0;
		this.maxLoopCount = this.loop ? (args.loopCount || -1) : -1; // eslint-disable-line
		this.remaining = 0;
		this.curInitial = 0;
		this.reset();
	}

	/**
	 * Should be called in the update() method of the current game state to
	 * update this Delay.
	 *
	 * @param delta The time that has elapsed since the last call to this
	 *        method.
	 */
	update(delta: number) {
		if (this.remaining > 0) {
			this.remaining -= delta;
			if (this.remaining <= 0 && this.callback) {
				this.callback(this);
			}
		}
		if (this.remaining <= 0) {
			if (this.loop) {
				if (this.maxLoopCount === -1 || this.loopCount < this.maxLoopCount - 1) {
					this.loopCount++;
					this.nextInitial(true);
				} else {
					this.loopCount = this.maxLoopCount;
					this.remaining = -1;
				}
			} else {
				this.remaining = Math.max(0, this.remaining);
			}
		}
		return this.isDone();
	}

	/**
	 * Returns the number of times this Delay has looped.
	 *
	 * @return The number of times this Delay has looped.
	 */
	getLoopCount(): number {
		return this.loopCount;
	}

	/**
	 * Returns the maximum delta value, or -1 if none was defined.
	 *
	 * @return The maximum delta value.
	 * @see getMinDelta()
	 */
	getMaxDelta(): number {
		return this.maxDelta ?? -1;
	}

	/**
	 * Returns the minimum delta value, or -1 if none was defined.
	 *
	 * @return The minimum delta value.
	 * @see getMaxDelta()
	 */
	getMinDelta(): number {
		return this.minDelta ?? -1;
	}

	/**
	 * Returns the remaining time on this delay.
	 *
	 * @return The remaining time on this delay.
	 */
	getRemaining(): number {
		return this.remaining;
	}

	/**
	 * Returns how far along we are in this delay, in the range
	 * 0 - 1.
	 *
	 * @return How far along we are in this delay.
	 */
	getRemainingPercent(): number {
		return this.remaining / this.curInitial;
	}

	/**
	 * Returns whether this Delay has completed.
	 *
	 * @return Whether this Delay has completed.
	 */
	isDone(): boolean {
		return (!this.loop || this.loopCount === this.maxLoopCount) &&
			this.remaining <= 0;
	}

	/**
	 * Advances this Delay so its next delay amount. Effectively does nothing
	 * in the common case where there's only one such delay amount.
	 *
	 * @param smooth Whether to do so smoothly.
	 */
	private nextInitial(smooth = false) {
		const prevRemaining: number = this.remaining;
		this.initialIndex = (this.initialIndex + 1) % this.initial.length;
		this.curInitial = this.remaining = this.initial[this.initialIndex];
		if (smooth && prevRemaining < 0) {
			this.remaining += prevRemaining; // Subtract how much we went over
		}
		if (this.minDelta || this.maxDelta) {
			//this.remaining += Utils.randomInt(this._minDelta, this._maxDelta);
		}
	}

	/**
	 * Causes this delay to trigger with a little random variance.
	 *
	 * @param min The minimum possible variance, inclusive.
	 * @param max The maximum possible variance, exclusive.
	 */
	setRandomDelta(min: number, max: number) {
		this.minDelta = min;
		this.maxDelta = max;
	}

	/**
	 * Resets this delay to its beginning. This essentially resets the amount
	 * of time it's been running to <code>0</code>.
	 */
	reset() {
		this.initialIndex = 0;
		this.curInitial = this.remaining = this.initial[this.initialIndex];
		this.loopCount = 0;
	}

	toString() {
		return `[Delay: initial=${this.initial.join(',')}, ` +
			`remaining=${this.remaining}, ` +
			`loop=${this.loop}, ` +
			`callback=${!!this.callback}]`;
	}

}
