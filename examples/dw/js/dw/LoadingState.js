var LoadingState = function(args) {
   'use strict';
   _BaseState.apply(this, args);
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
            var self = this;
            
setTimeout(function() {
      game.assets.addImage('title', 'res/title.png');
      game.assets.addSpriteSheet('hero', 'res/hero.png', 16, 16, 1, true);
      game.assets.addSpriteSheet('npcs', 'res/npcs.png', 16, 16, 1, true);
      game.assets.addImage('battleBG', 'res/battle_backgrounds.png');
      game.assets.addImage('font', 'res/font_10x10.png');
      game.assets.addCanvas('monsters', 'res/monsters.png');
      game.assets.addJson('res/enemyAtlas.json');
      game.assets.addJson('overworld.json');
      game.assets.addJson('brecconary.json');
      game.assets.addSound(Sounds.MUSIC_TITLE_SCREEN, 'res/sound/01 Dragon Quest 1 - Intro ~ Overture (22khz mono).ogg');
      game.assets.addSound(Sounds.MUSIC_TOWN, 'res/sound/04 Dragon Quest 1 - Peaceful Village (22khz mono).ogg');
      game.assets.addSound(Sounds.MUSIC_OVERWORLD, 'res/sound/05 Dragon Quest 1 - Kingdom of Alefgard (22khz mono).ogg');
      game.assets.addSound(Sounds.MUSIC_BATTLE, 'res/sound/14 Dragon Quest 1 - A Monster Draws Near (16khz mono).ogg', 2.32);
      game.assets.addSound('run',  'res/sound/30 Dragon Quest 1 - Stairs Down (22khz mono).wav');
      game.assets.addSound('menu', 'res/sound/32 Dragon Quest 1 - Menu Button (22khz mono).wav');
      game.assets.addSound('bump', 'res/sound/42 Dragon Quest 1 - Bumping into Walls (22khz mono).wav');
      game.assets.addSound('stairs', 'res/sound/30 Dragon Quest 1 - Stairs Down (22khz mono).wav');
      game.assets.onLoad(function() {
         
         // TODO: This could be done much, much more cleanly
         var enemyJson = game.assets.get('res/enemyAtlas.json');
         var atlas = new gtp.ImageAtlas({ atlasInfo: enemyJson, canvas: game.assets.get('monsters') });
         // delete game.assets.get('monsters');
         var images = atlas.parse();
         for (var id in images) {
            if (images.hasOwnProperty(id)) {
               game.assets.set(id, images[id]);
            }
         }
         
         var font = game.assets.get('font');
         game.assets.set('font', new gtp.BitmapFont(font, 18,20, 14,12));
         
         game.assets.addTmxMap(game.initLoadedMap('overworld.json'));
         game.assets.addTmxMap(game.initLoadedMap('brecconary.json'));
         game.assets.onLoad(function() {
            game.setState(new gtp.FadeOutInState(self, new GamesAtLunchAdvertState()));
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
