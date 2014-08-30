var TitleScreenState = function() {
   'use strict';
   this.assetsLoaded = false;
};
TitleScreenState.prototype = Object.create(_BaseState.prototype, {
   
   init: {
      value: function(game) {
         'use strict';
         _BaseState.prototype.init.apply(this, arguments);
         game.canvas.addEventListener('touchstart', this.handleStart, false);
      }
   },
   
   leaving: {
      value: function(game) {
         'use strict';
         game.canvas.removeEventListener('touchstart', this.handleStart, false);
      }
   },
   
handleStart: {
   value: function() {
      'use strict';
      console.log('yee, touch detected!');
      this._startGame();
   }
},

   update: {
      value: function(delta) {
         'use strict';
         
         this.handleDefaultKeys();
         
         var im = game.inputManager;
         if (im.isKeyDown(gtp.Keys.ENTER)) {
            this._startGame();
         }
         
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         var game = this.game;
         game.clearScreen();
         
         ctx.fillStyle = 'rgb(255, 255, 255)';
         ctx.font = 'bold 30px Arial';
         ctx.fillText('Press Enter', 150, game.getHeight()-40);
         
         var img = game.assets.get('title');
         var x = (game.getWidth() - img.width) / 2;
         var y = 30;
         img.draw(ctx, x, y);
      }
   },
   
   _adjustGameMap: {
      
      value: function() {
         'use strict';
         
         var map = game.map;
         
         // Hide layers that shouldn't be shown (why aren't they marked as hidden
         // in Tiled?)
         for (var i=0; i<map.getLayerCount(); i++) {
            var layer = map.getLayerByIndex(i);
            if (layer.name !== 'tileLayer') {
               layer.visible = false;
            }
         }
      }
      
   },
   
   _startGame: {
      value: function() {
         'use strict';
         game.hero.setMapLocation(52, 45);
         game.setMap('overworld.json');
         game.setState(new FadeOutInState(this, new RoamingState()));
      }
   }
   
});

TitleScreenState.prototype.constructor = TitleScreenState;
