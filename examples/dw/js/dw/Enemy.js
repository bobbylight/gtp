function Enemy(args) {
   'use strict';
   
   BattleEntity.apply(this, args); // TODO: Better way to do a mixin?
   gtp.Utils.mixin(RoamingEntity.prototype, this);
   BattleEntity.call(this);
   
   this.name = args.name;
   this._image = args.image;
   this._damagedImage = args.damagedImage;
}

Enemy.prototype = {
   
   getImage: function(hit) {
      'use strict';
      return game.assets.get(hit ? this._damagedImage : this._image);
   },
   
   isDead: function() {
      'use strict';
      return this.hp <= 0;
   }
   
};
