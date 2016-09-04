var gtp;
(function (gtp) {
    'use strict';
    var InputManager = (function () {
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
        function InputManager(keyRefireMillis) {
            this.keys = [];
            this._refireMillis = keyRefireMillis || 0;
            this._repeatTimers = [];
        }
        /**
         * Resets a specific key to its "not depressed" state.
         *
         * @param {int} key The key to reset.
         * @see clearKeyStates
         */
        InputManager.prototype.clearKeyState = function (key) {
            this.keys[key] = false;
            if (this._repeatTimers[key]) {
                clearInterval(this._repeatTimers[key]);
                this._repeatTimers[key] = null;
            }
        };
        /**
         * Resets all keys to be in their "not depressed" states.
         */
        InputManager.prototype.clearKeyStates = function () {
            for (var i = 0; i < this.keys.length; i++) {
                this.clearKeyState(i);
            }
        };
        /**
         * Returns whether ctrl is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.ctrl = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(gtp.Keys.KEY_CTRL, clear);
        };
        /**
         * Returns whether down is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.down = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(gtp.Keys.KEY_DOWN_ARROW, clear);
        };
        /**
         * Returns whether enter is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.enter = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(gtp.Keys.KEY_ENTER, clear);
        };
        /**
         * Installs this keyboard manager.  Should be called during game
         * initialization.
         */
        InputManager.prototype.install = function () {
            var self = this;
            document.onkeydown = function (e) { self._keyDown(e); };
            document.onkeyup = function (e) { self._keyUp(e); };
        };
        /**
         * Returns whether a specific key is pressed.
         * @param keyCode {gtp.Keys} A key code.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.isKeyDown = function (keyCode, clear) {
            if (clear === void 0) { clear = false; }
            var down = this.keys[keyCode];
            if (down && clear) {
                this.keys[keyCode] = false;
            }
            return down;
        };
        InputManager.prototype._keyDown = function (e) {
            var keyCode = e.keyCode;
            if (keyCode === 32 || (keyCode >= 37 && keyCode <= 40)) {
                e.preventDefault();
            }
            if (this._refireMillis) {
                if (!this._repeatTimers[keyCode]) {
                    this.keys[keyCode] = true;
                    var self = this;
                    this._repeatTimers[keyCode] = setInterval(function () {
                        //console.log('--- ' + new Date() + ': Setting keydown to true for: ' + keyCode + ', previous === ' + self.keys[keyCode]);
                        self.keys[keyCode] = true;
                    }, self._refireMillis);
                }
            }
            else {
                this.keys[keyCode] = true;
            }
            e.stopPropagation();
        };
        InputManager.prototype._keyUp = function (e) {
            var key = e.keyCode;
            if (this._refireMillis) {
                if (this._repeatTimers[key]) {
                    this.keys[key] = false;
                    clearInterval(this._repeatTimers[key]);
                    this._repeatTimers[key] = null;
                }
                else {
                    console.error('_keyUp: Timer does not exist for key: ' + key + '!');
                }
            }
            else {
                this.keys[key] = false;
            }
            e.stopPropagation();
        };
        /**
         * Returns whether left is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.left = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(gtp.Keys.KEY_LEFT_ARROW, clear);
        };
        /**
         * Returns whether right is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.right = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(gtp.Keys.KEY_RIGHT_ARROW, clear);
        };
        /**
         * Returns whether shift is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.shift = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(gtp.Keys.KEY_SHIFT, clear);
        };
        /**
         * Returns whether up is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.up = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(gtp.Keys.KEY_UP_ARROW, clear);
        };
        return InputManager;
    }());
    gtp.InputManager = InputManager;
})(gtp || (gtp = {}));

//# sourceMappingURL=InputManager.js.map
