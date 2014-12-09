function Enemy(args) {
   'use strict';
   
   BattleEntity.call(this, args); // TODO: Better way to do a mixin?
   gtp.Utils.mixin(RoamingEntity.prototype, this);
   
   this.name = args.name;
   this._image = args.image;
   this._damagedImage = args.damagedImage;
}

Enemy.prototype = Object.create(BattleEntity.prototype, {
   
   getImage: {
      value: function(hit) {
         'use strict';
         return game.assets.get(hit ? this._damagedImage : this._image);
      }
   }
      
});

Enemy.prototype.constructor = Enemy;
