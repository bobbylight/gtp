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

   isKeyDown: function(keyCode, clear) {
      var down = this.keys[keyCode];
      if (clear) {
         this.keys[keyCode] = false;
      }
      return down;
   }

};

/* const key codes */
gtp.InputManager.ENTER = 13;
gtp.InputManager.SHIFT = 16;
gtp.InputManager.SPACE = 32;
gtp.InputManager.LEFT_ARROW = 37;
gtp.InputManager.UP_ARROW = 38;
gtp.InputManager.RIGHT_ARROW = 39;
gtp.InputManager.DOWN_ARROW = 40;

gtp.InputManager.A = 65;
gtp.InputManager.B = 66;
gtp.InputManager.C = 67;
gtp.InputManager.D = 68;
gtp.InputManager.E = 69;
gtp.InputManager.F = 70;
gtp.InputManager.R = 82;
gtp.InputManager.S = 83;
gtp.InputManager.T = 84;
gtp.InputManager.W = 87;
gtp.InputManager.X = 88;
gtp.InputManager.Y = 89;
gtp.InputManager.Z = 90;
