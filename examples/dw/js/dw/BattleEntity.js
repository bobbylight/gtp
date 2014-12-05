function BattleEntity(args) {
   'use strict';
   args = args || {};
   this.hp = args.hp || 0;
   this.maxHp = args.hp || 0;
   this.mp = args.mp || 0;
   this.maxMp = args.mp || 0;
}
