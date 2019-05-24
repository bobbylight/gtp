import Utils from './Utils';

/**
 * This class keeps track of game time.  That includes both total running
 * time, and "active time" (time not spent on paused screens, etc.).
 */
export class _GameTimer {

	private startShift: number;
	private _paused: boolean;
	private pauseStart: number;
	private _updating: boolean;
	private notUpdatingStart: number;

	constructor() {
		this._paused = false;
		this.pauseStart = 0;
		this._updating = true;
		this.notUpdatingStart = 0;
		this.startShift = 0;
	}

	/**
	 * Returns whether this game is paused.
	 * @return Whether this game is paused.
	 */
	get paused(): boolean {
		return this._paused;
	}

	/**
	 * Returns the length of time the game has been played so far.  This is
	 * "playable time;" that is, time in which the user is playing, and the
	 * game is not paused or in a "not updating" state (such as the main
	 * frame not having focus).
	 *
	 * @return The amount of time the game has been played, in
	 *         milliseconds.
	 * @see resetPlayTime
	 */
	get playTime(): number {
		if (this.pauseStart !== 0) {
			return this.pauseStart - this.startShift;
		}
		if (this.notUpdatingStart !== 0) {
			return this.notUpdatingStart - this.startShift;
		}
		return Utils.timestamp() - this.startShift;
	}

	/**
	 * Returns whether this game is updating itself each frame.
	 *
	 * @return Whether this game is updating itself.
	 */
	get updating(): boolean {
		return this._updating;
	}

	/**
	 * Resets the "playtime in milliseconds" timer back to <code>0</code>.
	 *
	 * @see playTime
	 */
	resetPlayTime() {
		if (this.paused || !this.updating) {
			throw 'Cannot reset playtime millis when paused or not updating';
		}
		this.startShift = Utils.timestamp();
	}

	/**
	 * Sets whether the game is paused.  The game is still told to handle
	 * input, update itself and render.  This is simply a flag that should
	 * be set whenever a "pause" screen is displayed.  It stops the "in-game
	 * timer" until the game is unpaused.
	 *
	 * @param paused Whether the game should be paused.
	 * @see setUpdating
	 */
	set paused(paused: boolean) {
		// Cannot pause while !updating, so this is okay
		if (this._paused !== paused) {
			this._paused = paused;
			if (paused) {
				this.pauseStart = Utils.timestamp();
			}
			else {
				const pauseTime: number = Utils.timestamp() - this.pauseStart;
				this.startShift += pauseTime;
				this.pauseStart = 0;
			}
		}
	}

	/**
	 * Sets whether the game should be "updating" itself.  If a game is not
	 * "updating" itself, then it is effectively "paused," and will not accept
	 * any input from the user.<p>
	 *
	 * This method can be used to temporarily "pause" a game when the game
	 * window loses focus, for example.
	 *
	 * @param updating Whether the game should be updating itself.
	 */
	set updating(updating: boolean) {
		if (this._updating !== updating) {
			this._updating = updating;
			if (!this.paused) { // "pause" state "encompasses" update state.
				if (!this._updating) {
					this.notUpdatingStart = Utils.timestamp();
				}
				else {
					const notUpdatingTime: number = Utils.timestamp() - this.notUpdatingStart;
					this.startShift += notUpdatingTime;
					this.notUpdatingStart = 0;
				}
			}
		}
	}

	/**
	 * Resets this timer.  This should be called when a new game is started.
	 */
	start() {
		this.startShift = Utils.timestamp();
	}

}
