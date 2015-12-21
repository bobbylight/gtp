declare module gtp {
    /**
     * A simple x-y coordinate.
     */
    class Point {
        x: number;
        y: number;
        /**
         * Creates a <code>Point</code> instance.
         * @param {number} x The x-coordinate, or <code>0</code> if unspecified.
         * @param {number} y The y-coordinate, or <code>0</code> if unspecified.
         */
        constructor(x?: number, y?: number);
        /**
         * Returns whether this point is equal to another one.
         * @param {Point} other The point to compare to, which may be
         *        <code>null</code>.
         * @return Whether the two points are equal.
         */
        equals(other: Point): boolean;
    }
}
