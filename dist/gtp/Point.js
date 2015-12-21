var gtp;
(function (gtp) {
    'use strict';
    /**
     * A simple x-y coordinate.
     */
    var Point = (function () {
        /**
         * Creates a <code>Point</code> instance.
         * @param {number} x The x-coordinate, or <code>0</code> if unspecified.
         * @param {number} y The y-coordinate, or <code>0</code> if unspecified.
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        /**
         * Returns whether this point is equal to another one.
         * @param {Point} other The point to compare to, which may be
         *        <code>null</code>.
         * @return Whether the two points are equal.
         */
        Point.prototype.equals = function (other) {
            return other != null && this.x === other.x && this.y === other.y;
        };
        return Point;
    })();
    gtp.Point = Point;
})(gtp || (gtp = {}));

//# sourceMappingURL=Point.js.map
