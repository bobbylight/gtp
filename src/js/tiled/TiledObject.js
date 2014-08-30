var tiled = tiled || {};

tiled.TiledObject = function(data) {
   'use strict';
   gtp.Utils.mixin(data, this);
   this.properties = this.properties || {};
   this.gid = this.gid || -1;
this.x *= game._scale;
this.y *= game._scale;
this.width *= game._scale;
this.height *= game._scale;
};

tiled.TiledObject.prototype = {
   
   intersects: function(ox, oy, ow, oh) {
      'use strict';
      console.log(this.name + ": " + ox + ',' + oy + ',' + ow + ',' + oh + ' -> ' + this.x + ',' + this.y + ',' + this.width + ',' + this.height);
      var tw = this.width;
      var th = this.height;
      var rw = ow;
      var rh = oh;
      if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
          return false;
      }
      var tx = this.x;
      var ty = this.y;
      var rx = ox;
      var ry = oy;
      rw += rx;
      rh += ry;
      tw += tx;
      th += ty;
      //      overflow || intersect
      return ((rw < rx || rw > tx) &&
         (rh < ry || rh > ty) &&
         (tw < tx || tw > rx) &&
         (th < ty || th > ry));
   }

};
