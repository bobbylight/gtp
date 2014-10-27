function Enemy(args) {
   
   BattleEntity.call(this, args); // TODO: Better way to do a mixin?
   gtp.Utils.mixin(RoamingEntityMixin.prototype, this);
   BattleEntityMixin.call(this);
   
   this._name = args.name;
   this._image = args.image;
}

Enemy.prototype = {
   
   isDead: function() {
      return this.hp <= 0;
   }
   
};
