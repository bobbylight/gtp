var gtp = gtp || {};

gtp.InputManager = function() {
   this.keys = [];
};
  
gtp.InputManager.prototype = {
   
   install: function() {
      var self = this;
      document.onkeydown = function(e) { self._keyDown(e); };
      document.onkeyup = function(e) { self._keyUp(e); };
   },

   _keyDown: function(e) {
      var keyCode = e.keyCode;
      if (keyCode===32 || (keyCode>=37 && keyCode<=40)) { // An arrow key or space
         e.preventDefault();
      }
      this.keys[e.keyCode] = true;
      e.stopPropagation();
   },

   _keyUp: function(e) {
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
      var down = this.keys[keyCode];
      if (clear) {
         this.keys[keyCode] = false;
      }
      return down;
   }

};
