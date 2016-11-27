export default class Rectangle {

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
	constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
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
	containsRect(x2: number|Rectangle, y2: number = 0, w2: number = 0, h2: number = 0) {

		if (x2 instanceof Rectangle) {
			const r: Rectangle = <Rectangle>x2;
			y2 = r.y;
			w2 = r.w;
			h2 = r.h;
			x2 = r.x;
		}

		let w: number = this.w;
		let h: number = this.h;
		if ((w | h | w2 | h2) < 0) {
				// At least one of the dimensions is negative...
				return false;
		}
		// Note: if any dimension is zero, tests below must return false...
		let x: number = this.x;
		let y: number = this.y;
		if (x2 < x || y2 < y) {
				return false;
		}
		w += x;
		w2 += <number>x2;
		if (w2 <= x2) {
				// X+W overflowed or W was zero, return false if...
				// either original w or W was zero or
				// x+w did not overflow or
				// the overflowed x+w is smaller than the overflowed X+W
				if (w >= x || w2 > w) { return false; }
		} else {
				// X+W did not overflow and W was not zero, return false if...
				// original w was zero or
				// x+w did not overflow and x+w is smaller than X+W
				if (w >= x && w2 > w) { return false; }
		}
		h += y;
		h2 += y2;
		if (h2 <= y2) {
				if (h >= y || h2 > h) { return false; }
		} else {
				if (h >= y && h2 > h) { return false; }
		}
		return true;
	}

	/**
	 * Returns whether this rectangle intersects another.
	 *
	 * @param {Rectangle} rect2 Another rectangle to compare against.
	 *        This should not be null.
	 * @return {boolean} Whether the two rectangles intersect.
	 */
	intersects(rect2: Rectangle): boolean {

		let tw: number = this.w;
		let th: number = this.h;
		let rw: number = rect2.w;
		let rh: number = rect2.h;
		if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
			return false;
		}
		let tx: number = this.x;
		let ty: number = this.y;
		let rx: number = rect2.x;
		let ry: number = rect2.y;
		rw += rx;
		rh += ry;
		tw += tx;
		th += ty;
		//      overflow || intersect
		return ((rw < rx || rw > tx) &&
			(rh < ry || rh > ty) &&
			(tw < tx || tw > rx) &&
			(th < ty || th > ry));
	}

	/**
	 * Sets the bounds of this rectangle.
	 * @param {number} x The new x-coordinate.
	 * @param {number} y The new y-coordinate.
	 * @param {number} w The new width.
	 * @param {number} h The new height.
	 */
	set(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}
