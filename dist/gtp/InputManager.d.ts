declare module gtp {
    class InputManager {
        private keys;
        private _refireMillis;
        private _repeatTimers;
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
        constructor(keyRefireMillis?: number);
        /**
         * Resets a specific key to its "not depressed" state.
         *
         * @param {int} key The key to reset.
         * @see clearKeyStates
         */
        clearKeyState(key: gtp.Keys): void;
        /**
         * Resets all keys to be in their "not depressed" states.
         */
        clearKeyStates(): void;
        /**
         * Returns whether ctrl is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        ctrl(clear?: boolean): boolean;
        /**
         * Returns whether down is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        down(clear?: boolean): boolean;
        /**
         * Returns whether enter is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        enter(clear?: boolean): boolean;
        /**
         * Installs this keyboard manager.  Should be called during game
         * initialization.
         */
        install(): void;
        /**
         * Returns whether a specific key is pressed.
         * @param keyCode {gtp.Keys} A key code.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        isKeyDown(keyCode: number, clear?: boolean): boolean;
        _keyDown(e: KeyboardEvent): void;
        _keyUp(e: KeyboardEvent): void;
        /**
         * Returns whether left is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        left(clear?: boolean): boolean;
        /**
         * Returns whether right is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        right(clear?: boolean): boolean;
        /**
         * Returns whether shift is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        shift(clear?: boolean): boolean;
        /**
         * Returns whether up is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        up(clear?: boolean): boolean;
    }
}
