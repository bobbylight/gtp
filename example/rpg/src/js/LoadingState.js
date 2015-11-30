var LoadingState = function() {
   'use strict';
   this.assetsLoaded = false;
};

LoadingState.prototype = Object.create(_BaseState.prototype, {

   update: {
      value: function(delta) {
         'use strict';
         
         this.handleDefaultKeys();
         
         if (!this.assetsLoaded) {
            
            this.assetsLoaded = true;
            var self = this;
            //var game = this.game;
            
            game.assets.addImage('bg', 'res/add-on_6.png');
//               game.assets.addImage('font', 'res/font.png');
            game.assets.addJson('maps/overworld.json');
            game.assets.addSpriteSheet('hero', 'res/blauekrieger_modified.png', 18,26, 6,6, true);
//               game.assets.addSound('bump', 'res/sound/42 Dragon Quest 1 - Bumping into Walls (22khz mono).wav');
//               game.assets.addSound('menu', 'res/sound/32 Dragon Quest 1 - Menu Button (22khz mono).wav');
//               game.assets.addSound('stairs', 'res/sound/30 Dragon Quest 1 - Stairs Down (22khz mono).wav');

            game.assets.onLoad(function() {
               
//                  var font = game.assets.get('font');
//                  game.assets.set('font', new gtp.BitmapFont(font, 20,20, 12));
               
               var data = game.assets.get('maps/overworld.json');
               var imagePathModifier = function(imagePath) {
                  return imagePath.replace('../', '');
               };
               game.map = new tiled.TiledMap(data, {
                  imagePathModifier: imagePathModifier,
                  tileWidth: 16, tileHeight: 16,
                  screenWidth: game.getWidth(), screenHeight: game.getHeight()
               });
               self._adjustGameMap();
               game.assets.addTmxMap(game.map);
               game.map.setScale(game._scale);
               game.assets.onLoad(function() {
                  game.setState(new RoamingState());
               });
               
               // Hide layers that shouldn't be shown (why aren't they marked
               // as hidden in Tiled?)
               for (var i = 0; i < game.map.getLayerCount(); i++) {
                  var layer = game.map.getLayerByIndex(i);
                  if (layer.name.indexOf('tileLayer') !== 0) {
                     layer.visible = false;
                  }
               }
            });

         }
      
      }
   },
   
   render: {
      value: function() {
         'use strict';
         
         //var game = this.game;
         var ctx = game.canvas.getContext('2d');
         ctx.fillStyle = 'rgb(0, 0, 255)';
         ctx.fillRect(0,0, game.canvas.width, game.canvas.height);
         
         ctx.fillStyle = 'rgb(0, 0, 0)';
         ctx.font = 'bold 30px Arial';
         ctx.fillText('Loading...', 100, 100);
         
      }
   },
   
   _adjustGameMap: {
      
      value: function() {
         'use strict';
         
//         var map = game.map;
//         
//         // Hide layers that shouldn't be shown (why aren't they marked as hidden
//         // in Tiled?)
//         for (var i=0; i<map.getLayerCount(); i++) {
//            var layer = map.getLayerByIndex(i);
//            if (layer.name !== 'tileLayer') {
//               layer.visible = false;
//            }
//         }
      }
      
   }
   
});

LoadingState.prototype.constructor = LoadingState;
