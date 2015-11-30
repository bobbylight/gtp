/**
 * Functionality common amongst all states in this game.
 */
function _BaseState() {
}

_BaseState.prototype = Object.create(gtp.State.prototype, {
   
   handleDefaultKeys: {
      value: function() {
         'use strict';
         
         var im = game.inputManager;
         
         if (im.shift()) {
            
            if (im.isKeyDown(gtp.Keys.F, true)) {
               console.log('Toggling fps display...');
            }
            
         }
         
      }
   }
   
});

_BaseState.prototype.constructor = _BaseState;
