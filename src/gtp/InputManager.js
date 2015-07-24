var gtp = gtp || {};

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
gtp.InputManager = function(keyRefireMillis) {
   'use strict';
   this.keys = [];
   this._refireMillis = keyRefireMillis || 0;
   this._repeatTimers = [];
};
  
gtp.InputManager.prototype = {
   
   /**
    * Resets a specific key to its "not depressed" state.
    * 
    * @param {int} key The key to reset.
    * @see clearKeyStates
    */
   clearKeyState: function(key) {
      'use strict';
      this.keys[key] = false;
      if (this._repeatTimers[key]) {
         clearInterval(this._repeatTimers[key]);
         this._repeatTimers[key] = null;
      }
   },
   
   /**
    * Resets all keys to be in their "not depressed" states.
    */
   clearKeyStates: function() {
      'use strict';
      //console.log('Clearing ' + this.keys.length + ' keys');
      for (var i=0; i<this.keys.length; i++) {
         this.clearKeyState(i);
      }
   },
   
   /**
    * Returns whether down is pressed.
    * @param clear {boolean} Whether the key's state should be reset to "not
    *        pressed" when this method returns.  This is useful to effectively
    *        enable the keyboard's buffering.
    * @return {boolean} Whether the key was pressed.
    */
   down: function(clear) {
      'use strict';
      return this.isKeyDown(gtp.Keys.DOWN_ARROW, clear);
   },
   
   /**
    * Returns whether enter is pressed.
    * @param clear {boolean} Whether the key's state should be reset to "not
    *        pressed" when this method returns.  This is useful to effectively
    *        enable the keyboard's buffering.
    * @return {boolean} Whether the key was pressed.
    */
   enter: function(clear) {
      'use strict';
      return this.isKeyDown(gtp.Keys.ENTER, clear);
   },
   
   /**
    * Installs this keyboard manager.  Should be called during game
    * initialization.
    */
   install: function() {
      'use strict';
      var self = this;
      document.onkeydown = function(e) { self._keyDown(e); };
      document.onkeyup = function(e) { self._keyUp(e); };
   },

   _keyDown: function(e) {
      'use strict';
      var keyCode = e.keyCode;
      if (keyCode===32 || (keyCode>=37 && keyCode<=40)) { // An arrow key or space
         e.preventDefault();
      }
      if (this._refireMillis) {
         if (!this._repeatTimers[keyCode]) { // Only do on actual keydown, not key repeat
            if (keyCode === 90) {
               console.log('_keyDown: Setting to true for 90');
            }
            this.keys[keyCode] = true;
            var self = this;
            this._repeatTimers[keyCode] = setInterval(function() {
               console.log('--- ' + new Date() + ': Setting keydown to true for: ' + keyCode + ', previous === ' + self.keys[keyCode]);
               self.keys[keyCode] = true;
            }, self._refireMillis);
         }
      }
      else {
         this.keys[keyCode] = true;
      }
      e.stopPropagation();
   },

   _keyUp: function(e) {
      'use strict';
      var key = e.keyCode;
      if (this._refireMillis) {
         if (this._repeatTimers[key]) { // Should always be true
            this.keys[key] = false;
            if (key === 90) {
               console.log('_keyUp: Setting to false for 90');
            }
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
   },
   
   /**
    * Returns whether a specific key is pressed.
    * @param keyCode {gtp.Keys} A key code.
    * @param clear {boolean} Whether the key's state should be reset to "not
    *        pressed" when this method returns.  This is useful to effectively
    *        enable the keyboard's buffering.
    * @return {boolean} Whether the key was pressed.
    */
   isKeyDown: function(keyCode, clear) {
      'use strict';
      var down = this.keys[keyCode];
      if (down && clear) {
         this.keys[keyCode] = false;
      }
      return down;
   },
   
   /**
    * Returns whether left is pressed.
    * @param clear {boolean} Whether the key's state should be reset to "not
    *        pressed" when this method returns.  This is useful to effectively
    *        enable the keyboard's buffering.
    * @return {boolean} Whether the key was pressed.
    */
   left: function(clear) {
      'use strict';
      return this.isKeyDown(gtp.Keys.LEFT_ARROW, clear);
   },
   
   /**
    * Returns whether right is pressed.
    * @param clear {boolean} Whether the key's state should be reset to "not
    *        pressed" when this method returns.  This is useful to effectively
    *        enable the keyboard's buffering.
    * @return {boolean} Whether the key was pressed.
    */
   right: function(clear) {
      'use strict';
      return this.isKeyDown(gtp.Keys.RIGHT_ARROW, clear);
   },
   
   /**
    * Returns whether up is pressed.
    * @param clear {boolean} Whether the key's state should be reset to "not
    *        pressed" when this method returns.  This is useful to effectively
    *        enable the keyboard's buffering.
    * @return {boolean} Whether the key was pressed.
    */
   up: function(clear) {
      'use strict';
      return this.isKeyDown(gtp.Keys.UP_ARROW, clear);
   }
   
};
