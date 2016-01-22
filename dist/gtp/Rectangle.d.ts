declare module gtp {
    class Rectangle {
        x: number;
        y: number;
        w: number;
        h: number;
        /**
         * A simple rectangle class, containing some useful utility methods.
         *
         * @constructor
         * @param {int} x The x-coordinate, defaulting to <code>0</code>.
         * @param {int} y The y-coordinate, defaulting to <code>0</code>.
         * @param {int} w The width of the rectangle, defaulting to <code>0</code>.
         * @param {int} h The height of the rectangle, defaulting to <code>0</code>.
         */
        constructor(x?: number, y?: number, w?: number, h?: number);
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
        containsRect(x2: number | Rectangle, y2?: number, w2?: number, h2?: number): boolean;
        /**
         * Returns whether this rectangle intersects another.
         *
         * @param {gtp.Rectangle} rect2 Another rectangle to compare against.
         *        This should not be null.
         * @return {boolean} Whether the two rectangles intersect.
         */
        intersects(rect2: gtp.Rectangle): boolean;
        /**
         * Sets the bounds of this rectangle.
         * @param {number} x The new x-coordinate.
         * @param {number} y The new y-coordinate.
         * @param {number} w The new width.
         * @param {number} h The new height.
         */
        set(x: number, y: number, w: number, h: number): void;
    }
}
