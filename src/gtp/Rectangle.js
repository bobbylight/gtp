/**
 * @namespace
 */
var gtp = gtp || {};

/**
 * A simple rectangle class, containing some useful utility methods.
 * 
 * @constructor
 * @param {int} [x=0] The x-coordinate.
 * @param {int} [y=0] The y-coordinate.
 * @param {int} [w=0] The width of the rectangle.
 * @param {int} [h=0] The height of the rectangle.
 */
gtp.Rectangle = function(x, y, w, h) {
   'use strict';
   this.x = x || 0;
   this.y = y || 0;
   this.w = w || 0;
   this.h = h || 0;
};

gtp.Rectangle.prototype = Object.create({
   
   /**
    * Returns whether this rectangle intersects another.
    * 
    * @param {gtp.Rectangle} rect2 Another rectangle to compare against.  This
    *        should not be null.
    * @return {boolean} Whether the two rectangles intersect.
    */
   intersects: function(rect2) {
      'use strict';
      
      var tw = this.w;
      var th = this.h;
      var rw = rect2.w;
      var rh = rect2.h;
      if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
         return false;
      }
      var tx = this.x;
      var ty = this.y;
      var rx = rect2.x;
      var ry = rect2.y;
      rw += rx;
      rh += ry;
      tw += tx;
      th += ty;
      console.log(rx, ry, rw, rh, tx, ty, tw, th);
      //      overflow || intersect
      return ((rw < rx || rw > tx) &&
              (rh < ry || rh > ty) &&
              (tw < tx || tw > rx) &&
              (th < ty || th > ry));
   }
   
});

gtp.Rectangle.prototype.constructor = gtp.Rectangle;
