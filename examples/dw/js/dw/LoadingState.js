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
            var game = this.game;
            
setTimeout(function() {
      game.assets.addImage('title', 'res/title.png');
      game.assets.addSpriteSheet('hero', 'res/hero.png', 16, 16, 1, true);
      game.assets.addSpriteSheet('npcs', 'res/npcs.png', 16, 16, 1, true);
      game.assets.addImage('battleBG', 'res/battle_backgrounds.png');
      game.assets.addImage('font', 'res/font_10x10.png');
      game.assets.addJson('overworld.json');
      game.assets.addJson('brecconary.json');
      game.assets.addSound('titleMusic', 'res/sound/01 Dragon Quest 1 - Intro ~ Overture (22khz mono).ogg');
      game.assets.addSound('overworldMusic', 'res/sound/05 Dragon Quest 1 - Kingdom of Alefgard (22khz mono).ogg');
      game.assets.addSound('bump', 'res/sound/42 Dragon Quest 1 - Bumping into Walls (22khz mono).wav');
      game.assets.addSound('menu', 'res/sound/32 Dragon Quest 1 - Menu Button (22khz mono).wav');
      game.assets.addSound('stairs', 'res/sound/30 Dragon Quest 1 - Stairs Down (22khz mono).wav');
      game.assets.onLoad(function() {
         
         var font = game.assets.get('font');
         game.assets.set('font', new gtp.BitmapFont(font, 20,20, 12));
         
         game.assets.addTmxMap(game.initLoadedMap('overworld.json'));
         game.assets.addTmxMap(game.initLoadedMap('brecconary.json'));
         game.assets.onLoad(function() {
            game.setState(new TitleScreenState());
         });
      });
}, 1000);

         }
      
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         var game = this.game;
         game.clearScreen('rgb(0,0,255)');
         
         ctx.fillStyle = 'rgb(0, 0, 0)';
         ctx.font = 'bold 30px Arial';
         ctx.fillText('Loading...', 100, 100);
         
      }
   }
   
});

LoadingState.prototype.constructor = LoadingState;