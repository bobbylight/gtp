function BattleEntity(args) {
   args = args || {};
   this.hp = args.maxHp || 0;
   this.maxHp = args.maxHp || 0;
   this.mp = args.maxMp || 0;
   this.maxMp = args.maxMp || 0;
}
