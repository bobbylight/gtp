function Enemy(args) {
   'use strict';
   
   BattleEntity.call(this, args); // TODO: Better way to do a mixin?
   gtp.Utils.mixin(RoamingEntity.prototype, this);
   BattleEntity.call(this);
   
   this._name = args.name;
   this._image = args.image;
}

Enemy.prototype = {
   
   isDead: function() {
      'use strict';
      return this.hp <= 0;
   }
   
};
