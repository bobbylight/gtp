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
         this._delay = new gtp.Delay([ 600, 400 ]);
         this._blink = true;
         game.audio.playMusic('titleMusic');
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
         
         if (this._delay.update(delta)) {
            this._delay.reset();
            this._blink = !this._blink;
         }
         
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
         var w = game.getWidth();
         
         var img = game.assets.get('title');
         var x = (w - img.width) / 2;
         var y = 30;
         img.draw(ctx, x, y);
         
         if (this._blink) {
            var prompt = 'Press Enter';
            x = (w - game.stringWidth(prompt)) / 2;
            y = game.getHeight() - 40;
            game.drawString(prompt, x, y);
         }
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
         game.setMap('overworld.json');
         game.hero.setMapLocation(52, 45);
         game.setState(new gtp.FadeOutInState(this, new RoamingState()));
      }
   }
   
});

TitleScreenState.prototype.constructor = TitleScreenState;