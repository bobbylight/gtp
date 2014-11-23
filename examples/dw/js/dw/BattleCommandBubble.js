function BattleCommandBubble() {
   'use strict';
   var tileSize = game.getTileSize();
   var scale = game._scale;
   Bubble.call(this, "COMMAND", 90*scale, tileSize, 150*scale, 60*scale);
   this.selection = 0;
}

BattleCommandBubble.prototype = Object.create(Bubble.prototype, {
   
   handleCommandChosen: {
      value: function(/*BattleState*/ state) {
         'use strict';
         
         switch (this.selection) {
      
            case 0: // Fight
               state.fight();
               break;
      
            case 1: // Run
               state.run();
               break;
      
            case 2: // Spell
               state.spell();
               break;
      
            case 3: // Item
               state.item();
               break;
            
         }
         
      }
   },
   
   handleInput: {
      
      value: function() {
         'use strict';
         
         var im = game.inputManager;
         
         if (im.up(true)) {
            this.selection = this.selection - 1;
            if (this.selection<0) {
               this.selection = 3;
            }
         }
      
         else if (im.down(true)) {
            this.selection = Math.floor((this.selection+1) % 4);
         }
      
         else if (this.selection>1 && im.left(true)) {
            this.selection -= 2;
         }
      
         else if (this.selection<2 && im.right(true)) {
            this.selection += 2;
         }
      
         else if (game.cancelKeyPressed()) {
            this.reset();
            return false;
         }
      
         else if (game.actionKeyPressed()) {
            game.audio.playSound('menu');
            return true;
         }
      
         return false;
      
      }
   },
   
   paintContent: {
      
      value: function(ctx, y) {
         'use strict';
      
         var SCALE = game._scale;
         var x = this.x + 20*SCALE;
         var y0 = y;
         var Y_INC = game.stringHeight() + 7*SCALE;
      
         game.drawString("Fight", x, y0); y0 += Y_INC;
         game.drawString("Run", x, y0); y0 += Y_INC;
      
         x += 70 * SCALE;
         y0 -= 2*Y_INC;
         game.drawString("Spell", x, y0); y0 += Y_INC;
         game.drawString("Item", x, y0); y0 += Y_INC;
      
         if (this.selection<2) {
            x -= 70 * SCALE;
         }
         x -= game.stringWidth(">") + 2*SCALE;
         y0 = y + Y_INC * (this.selection%2);
      
         game.drawArrow(x, y0); // DEL, but we use for our arrow
      
      }
   },
   
   reset: {
      value: function() {
         'use strict';
         this.selection = 0;
      }
   }

});

BattleCommandBubble.prototype.constructor = BattleCommandBubble;
