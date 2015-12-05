var gtp;
(function (gtp) {
    'use strict';
    var Rectangle = (function () {
        /**
         * A simple rectangle class, containing some useful utility methods.
         *
         * @constructor
         * @param {int} [x=0] The x-coordinate.
         * @param {int} [y=0] The y-coordinate.
         * @param {int} [w=0] The width of the rectangle.
         * @param {int} [h=0] The height of the rectangle.
         */
        function Rectangle(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        /**
         * Returns whether this rectangle intersects another.
         *
         * @param {gtp.Rectangle} rect2 Another rectangle to compare against.  This
         *        should not be null.
         * @return {boolean} Whether the two rectangles intersect.
         */
        Rectangle.prototype.intersects = function (rect2) {
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
        };
        return Rectangle;
    })();
    gtp.Rectangle = Rectangle;
})(gtp || (gtp = {}));

//# sourceMappingURL=Rectangle.js.map
