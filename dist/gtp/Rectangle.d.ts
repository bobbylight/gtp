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
         * @param {int} [x=0] The x-coordinate.
         * @param {int} [y=0] The y-coordinate.
         * @param {int} [w=0] The width of the rectangle.
         * @param {int} [h=0] The height of the rectangle.
         */
        constructor(x?: number, y?: number, w?: number, h?: number);
        /**
         * Returns whether this rectangle intersects another.
         *
         * @param {gtp.Rectangle} rect2 Another rectangle to compare against.  This
         *        should not be null.
         * @return {boolean} Whether the two rectangles intersect.
         */
        intersects(rect2: gtp.Rectangle): boolean;
    }
}
