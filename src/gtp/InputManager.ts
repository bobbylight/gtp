import { Keys } from './Keys';

/**
 * Handles input for games.<p>
 *
 * For keyboards, allows polling of individual key presses, both with and
 * without the keyboard repeat delay.<p>
 *
 * Touch and mouse input are currently not supported.
 */
export default class InputManager {

	private keys: boolean[];
	private _refireMillis: number;
	private _repeatTimers: { [key: number/*Keys*/]: any };

	/**
	 * Handles input for games.<p>
	 *
	 * For keyboards, allows polling of individual key presses, both with and
	 * without the keyboard repeat delay.<p>
	 *
	 * Touch and mouse input are currently not supported.
	 *
	 * @constructor
	 * @param {int} [keyRefireMillis=0] What the key refiring time should be, in
	 *        milliseconds.  A value of 0 means to take the operating system
	 *        default.
	 */
	constructor(keyRefireMillis: number = 0) {
		this.keys = [];
		this._refireMillis = keyRefireMillis;
		this._repeatTimers = [];
	}

	/**
	 * Resets a specific key to its "not depressed" state.
	 *
	 * @param {int} key The key to reset.
	 * @see clearKeyStates
	 */
	clearKeyState(key: Keys) {
		this.keys[key] = false;
		if (this._repeatTimers[key]) {
			clearInterval(this._repeatTimers[key]);
			this._repeatTimers[key] = null;
		}
	}

	/**
	 * Resets all keys to be in their "not depressed" states.
	 */
	clearKeyStates() {
		for (let i: number = 0; i < this.keys.length; i++) {
			this.clearKeyState(i);
		}
	}

	/**
	 * Returns whether ctrl is pressed.
	 * @param clear {boolean} Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return {boolean} Whether the key was pressed.
	 */
	ctrl(clear: boolean = false) {
		return this.isKeyDown(Keys.KEY_CTRL, clear);
	}

	/**
	 * Returns whether down is pressed.
	 * @param clear {boolean} Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return {boolean} Whether the key was pressed.
	 */
	down(clear: boolean = false) {
		return this.isKeyDown(Keys.KEY_DOWN_ARROW, clear);
	}

	/**
	 * Returns whether enter is pressed.
	 * @param clear {boolean} Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return {boolean} Whether the key was pressed.
	 */
	enter(clear: boolean = false) {
		return this.isKeyDown(Keys.KEY_ENTER, clear);
	}

	/**
	 * Installs this keyboard manager.  Should be called during game
	 * initialization.
	 */
	install() {
		document.onkeydown = (e: KeyboardEvent) => { this._keyDown(e); };
		document.onkeyup = (e:  KeyboardEvent) => { this._keyUp(e); };
	}

	/**
	 * Returns whether a specific key is pressed.
	 * @param keyCode {Keys} A key code.
	 * @param clear {boolean} Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return {boolean} Whether the key was pressed.
	 */
	isKeyDown(keyCode: number, clear: boolean = false) {
		const down: boolean = this.keys[keyCode];
		if (down && clear) {
			this.keys[keyCode] = false;
		}
		return down;
	}

	_keyDown(e: KeyboardEvent) {
		const keyCode: number = e.keyCode;
		if (keyCode === 32 || (keyCode >= 37 && keyCode <= 40)) { // An arrow key or space
			e.preventDefault();
		}
		if (this._refireMillis) {
			if (!this._repeatTimers[keyCode]) { // Only do on actual keydown, not key repeat
				this.keys[keyCode] = true;
				this._repeatTimers[keyCode] = setInterval(() => {
					//console.log('--- ' + new Date() + ': Setting keydown to true for: ' + keyCode + ', previous === ' + self.keys[keyCode]);
					this.keys[keyCode] = true;
				}, this._refireMillis);
			}
		}
		else {
			this.keys[keyCode] = true;
		}
		e.stopPropagation();
	}

	_keyUp(e: KeyboardEvent) {
		const key: number = e.keyCode;
		if (this._refireMillis) {
			if (this._repeatTimers[key]) { // Should always be true
				this.keys[key] = false;
				clearInterval(this._repeatTimers[key]);
				this._repeatTimers[key] = null;
			}
			else {
				console.error(`_keyUp: Timer does not exist for key: ${key}!`);
			}
		}
		else {
			this.keys[key] = false;
		}
		e.stopPropagation();
	}

	/**
	 * Returns whether left is pressed.
	 * @param clear {boolean} Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return {boolean} Whether the key was pressed.
	 */
	left(clear: boolean = false) {
		return this.isKeyDown(Keys.KEY_LEFT_ARROW, clear);
	}

	/**
	 * Returns whether right is pressed.
	 * @param clear {boolean} Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return {boolean} Whether the key was pressed.
	 */
	right(clear: boolean = false) {
		return this.isKeyDown(Keys.KEY_RIGHT_ARROW, clear);
	}

	/**
	 * Returns whether shift is pressed.
	 * @param clear {boolean} Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return {boolean} Whether the key was pressed.
	 */
	shift(clear: boolean = false) {
		return this.isKeyDown(Keys.KEY_SHIFT, clear);
	}

	/**
	 * Returns whether up is pressed.
	 * @param clear {boolean} Whether the key's state should be reset to "not
	 *        pressed" when this method returns.  This is useful to effectively
	 *        enable the keyboard's buffering.
	 * @return {boolean} Whether the key was pressed.
	 */
	up(clear: boolean = false) {
		return this.isKeyDown(Keys.KEY_UP_ARROW, clear);
	}
}
