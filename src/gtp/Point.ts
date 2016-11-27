/**
 * A simple x-y coordinate.
 */
export default class Point {

	x: number;
	y: number;

	/**
	 * Creates a <code>Point</code> instance.
	 * @param {number} x The x-coordinate, or <code>0</code> if unspecified.
	 * @param {number} y The y-coordinate, or <code>0</code> if unspecified.
	 */
	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Returns whether this point is equal to another one.
	 * @param {Point} other The point to compare to, which may be
	 *        <code>null</code>.
	 * @return Whether the two points are equal.
	 */
	equals(other: Point | null): boolean {
		return other != null && this.x === other.x && this.y === other.y;
	}
}
