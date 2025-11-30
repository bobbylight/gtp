import { Keys } from './Keys.js';

/**
 * Handles input for games.<p>
 *
 * For keyboards, allows polling of individual key presses, both with and
 * without the keyboard repeat delay.<p>
 *
 * Touch and mouse input are currently not supported.
 */
export default class InputManager {

	private readonly keys: boolean[];
	private readonly refireMillis: number;
	private readonly repeatTimers: Record<number/*Keys*/, number>;

	/**
	 * Handles input for games.<p>
	 *
	 * For keyboards, allows polling of individual key presses, both with and
	 * without the keyboard repeat delay.<p>
	 *
	 * Touch and mouse input are currently not supported.
	 *
	 * @param [keyRefireMillis=0] What the key refiring time should be, in milliseconds.
	 *        This is useful if you plan on using the <code>clear</code> argument when querying
	 *        for key states, as it dictates how frequently the key's down status will refire.
	 *        It's not useful and effectively ignored if you never use <code>clear</code>.
	 *        A value of 0 means keys will not send repeat "pressed" events.
	 */
	constructor(keyRefireMillis = 0) {
		this.keys = [];
		this.refireMillis = keyRefireMillis;
		this.repeatTimers = [];
	}

	/**
	 * Resets a specific key to its "not depressed" state.
	 *
	 * @param key The key to reset.
	 * @see clearKeyStates
	 */
	clearKeyState(key: Keys) {
		this.keys[key] = false;
		if (this.repeatTimers[key]) {
			clearInterval(this.repeatTimers[key]);
			delete this.repeatTimers[key];
		}
	}

	/**
	 * Resets all keys to be in their "not depressed" states.
	 */
	clearKeyStates() {
		for (let i = 0; i < this.keys.length; i++) {
			this.clearKeyState(i);
		}
	}

	/**
	 * Returns whether ctrl is pressed.
	 * @param clear Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return Whether the key was pressed.
	 */
	ctrl(clear = false) {
		return this.isKeyDown(Keys.KEY_CTRL, clear);
	}

	/**
	 * Returns whether down is pressed.
	 * @param clear Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return Whether the key was pressed.
	 */
	down(clear = false) {
		return this.isKeyDown(Keys.KEY_DOWN_ARROW, clear);
	}

	/**
	 * Returns whether enter is pressed.
	 * @param clear Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return Whether the key was pressed.
	 */
	enter(clear = false) {
		return this.isKeyDown(Keys.KEY_ENTER, clear);
	}

	/**
	 * Installs this keyboard manager.  Should be called during game
	 * initialization.
	 */
	install() {
		document.onkeydown = (e: KeyboardEvent) => { this.keyDown(e); };
		document.onkeyup = (e: KeyboardEvent) => { this.keyUp(e); };
	}

	/**
	 * Returns whether a specific key is pressed.
	 * @param keyCode A key code.
	 * @param clear Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return Whether the key was pressed.
	 */
	isKeyDown(keyCode: number, clear = false) {
		const down: boolean = this.keys[keyCode] ?? false;
		if (down && clear) {
			this.keys[keyCode] = false;
		}
		return down;
	}

	private keyDown(e: KeyboardEvent) {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		const keyCode: number = e.keyCode;
		if (keyCode === 32 || (keyCode >= 37 && keyCode <= 40)) { // An arrow key or space
			e.preventDefault();
		}
		if (this.refireMillis) {
			if (!this.repeatTimers[keyCode]) { // Only do on actual keydown, not key repeat
				this.keys[keyCode] = true;
				this.repeatTimers[keyCode] = setInterval(() => {
					//console.log(`--- ${new Date()}: Setting keydown to true for: ${keyCode}, previous === ${self.keys[keyCode]}`);
					this.keys[keyCode] = true;
				}, this.refireMillis);
			}
		} else {
			this.keys[keyCode] = true;
		}
		e.stopPropagation();
	}

	private keyUp(e: KeyboardEvent) {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		const key: number = e.keyCode;
		if (this.refireMillis) {
			if (this.repeatTimers[key]) { // Should always be true
				this.keys[key] = false;
				clearInterval(this.repeatTimers[key]);
				delete this.repeatTimers[key];
			} else {
				console.error(`keyUp: Timer does not exist for key: ${key}!`);
			}
		} else {
			this.keys[key] = false;
		}
		e.stopPropagation();
	}

	/**
	 * Returns whether left is pressed.
	 * @param clear Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return Whether the key was pressed.
	 */
	left(clear = false) {
		return this.isKeyDown(Keys.KEY_LEFT_ARROW, clear);
	}

	/**
	 * Returns whether right is pressed.
	 * @param clear Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return Whether the key was pressed.
	 */
	right(clear = false) {
		return this.isKeyDown(Keys.KEY_RIGHT_ARROW, clear);
	}

	/**
	 * Returns whether shift is pressed.
	 * @param clear Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return Whether the key was pressed.
	 */
	shift(clear = false) {
		return this.isKeyDown(Keys.KEY_SHIFT, clear);
	}

	/**
	 * Returns whether up is pressed.
	 * @param clear Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return Whether the key was pressed.
	 */
	up(clear = false) {
		return this.isKeyDown(Keys.KEY_UP_ARROW, clear);
	}
}
