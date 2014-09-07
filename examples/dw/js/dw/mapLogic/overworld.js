/**
 * Logic for the overworld.
 * @constructor
 */
function Overworld() {
   
}

Overworld.prototype = (function() {
   'use strict';
   
   var initialTalks = {
   };
   
   return Object.create(MapLogic.prototype, {
      
      init: {
         value: function() {
         }
      },
      
      npcText: {
         value: function(npc) {
            console.log('Talking to: ' + JSON.stringify(npc));
            return initialTalks[npc.name] || 'I have nothing to say...';
         }
      }
   
   });
   
})();

Overworld.prototype.constructor = Overworld;
