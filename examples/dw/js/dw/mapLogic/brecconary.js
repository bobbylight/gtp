/**
 * Logic for the town of Brecconary.
 * @constructor
 */
function Brecconary() {
   
}

Brecconary.prototype = (function() {
   'use strict';
   
   var initialTalks = {
      'greeter': [ 'Brave traveller, you must save us from the dreaded Dragon Lord!!',
            'But you should buy some supplies before venturing out...' ],
      'merchant1': 'Sorry, I\'m all sold out of stuff.',
      'innkeeper': 'All rooms are full.  Find somewhere else.'
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

Brecconary.prototype.constructor = Brecconary;
