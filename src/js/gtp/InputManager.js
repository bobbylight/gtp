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
 */
gtp.InputManager = function() {
   'use strict';
   this.keys = [];
};
  
gtp.InputManager.prototype = {
   
   /**
    * Resets all keys to be in their "not depressed" states.
    */
   clearKeyStates: function() {
      'use strict';
      //console.log('Clearing ' + this.keys.length + ' keys');
      for (var i=0; i<this.keys.length; i++) {
         this.keys[i] = false;
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
      this.keys[e.keyCode] = true;
      e.stopPropagation();
   },

   _keyUp: function(e) {
      'use strict';
      this.keys[e.keyCode] = false;
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
      if (clear) {
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
