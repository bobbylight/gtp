var gtp;
(function (gtp) {
    'use strict';
    var Rectangle = (function () {
        /**
         * A simple rectangle class, containing some useful utility methods.
         *
         * @constructor
         * @param {int} x The x-coordinate, defaulting to <code>0</code>.
         * @param {int} y The y-coordinate, defaulting to <code>0</code>.
         * @param {int} w The width of the rectangle, defaulting to <code>0</code>.
         * @param {int} h The height of the rectangle, defaulting to <code>0</code>.
         */
        function Rectangle(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.set(x, y, w, h);
        }
        /**
         * Returns whether one rectangle contains another.
         *
         * @param {number|Rectangle} x2 Either a second rectangle, or the
         *        x-coordinate of the second rectangle.
         * @param {number} y2 The y-coordinate of the second rectangle, if
         *        specifying the dimensions as separate arguments.
         * @param {number} w2 The width of the second rectangle, if
         *        specifying the dimensions as separate arguments.
         * @param {number} h2 The height of the second rectangle, if
         *        specifying the dimensions as separate arguments.
         * @return Whether this rectangle contains the specified rectangle.
         */
        Rectangle.prototype.containsRect = function (x2, y2, w2, h2) {
            if (y2 === void 0) { y2 = 0; }
            if (w2 === void 0) { w2 = 0; }
            if (h2 === void 0) { h2 = 0; }
            if (x2 instanceof Rectangle) {
                var r = x2;
                y2 = r.y;
                w2 = r.w;
                h2 = r.h;
                x2 = r.x;
            }
            var w = this.w;
            var h = this.h;
            if ((w | h | w2 | h2) < 0) {
                // At least one of the dimensions is negative...
                return false;
            }
            // Note: if any dimension is zero, tests below must return false...
            var x = this.x;
            var y = this.y;
            if (x2 < x || y2 < y) {
                return false;
            }
            w += x;
            w2 += x2;
            if (w2 <= x2) {
                // X+W overflowed or W was zero, return false if...
                // either original w or W was zero or
                // x+w did not overflow or
                // the overflowed x+w is smaller than the overflowed X+W
                if (w >= x || w2 > w) {
                    return false;
                }
            }
            else {
                // X+W did not overflow and W was not zero, return false if...
                // original w was zero or
                // x+w did not overflow and x+w is smaller than X+W
                if (w >= x && w2 > w) {
                    return false;
                }
            }
            h += y;
            h2 += y2;
            if (h2 <= y2) {
                if (h >= y || h2 > h) {
                    return false;
                }
            }
            else {
                if (h >= y && h2 > h) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Returns whether this rectangle intersects another.
         *
         * @param {gtp.Rectangle} rect2 Another rectangle to compare against.
         *        This should not be null.
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
            //      overflow || intersect
            return ((rw < rx || rw > tx) &&
                (rh < ry || rh > ty) &&
                (tw < tx || tw > rx) &&
                (th < ty || th > ry));
        };
        /**
         * Sets the bounds of this rectangle.
         * @param {number} x The new x-coordinate.
         * @param {number} y The new y-coordinate.
         * @param {number} w The new width.
         * @param {number} h The new height.
         */
        Rectangle.prototype.set = function (x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        };
        return Rectangle;
    }());
    gtp.Rectangle = Rectangle;
})(gtp || (gtp = {}));

//# sourceMappingURL=Rectangle.js.map
