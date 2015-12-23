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
    })();
    gtp.Rectangle = Rectangle;
})(gtp || (gtp = {}));

//# sourceMappingURL=Rectangle.js.map
