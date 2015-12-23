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
