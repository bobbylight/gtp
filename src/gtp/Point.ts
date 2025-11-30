/**
 * A simple x-y coordinate.
 */
export default class Point {

	x: number;
	y: number;

	/**
	 * Creates a <code>Point</code> instance.
	 * @param x The x-coordinate, or <code>0</code> if unspecified.
	 * @param y The y-coordinate, or <code>0</code> if unspecified.
	 */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Returns whether this point is equal to another one.
	 * @param other The point to compare to, which may be <code>null</code>.
	 * @return Whether the two points are equal.
	 */
	equals(other: Point | null): boolean {
		return !!other && this.x === other.x && this.y === other.y;
	}
}
