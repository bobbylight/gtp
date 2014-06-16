/**
 * Functionality common amongst all states in this game.
 */
function _BaseState() {
}

_BaseState.prototype = Object.create(gtp.State.prototype, {
   
   handleDefaultKeys: {
      value: function() {
         
         var im = this.game.inputManager;
         
         if (im.isKeyDown(gtp.InputManager.SHIFT)) {
            
            if (im.isKeyDown(gtp.InputManager.F, true)) {
               console.log('Toggling fps display...');
            }
            
         }
         
      }
   }
   
});

_BaseState.prototype.constructor = _BaseState;
