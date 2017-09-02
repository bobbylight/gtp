/**
 * Defines the shape of rectangular data, for compatibility with APIs that don't deal with <code>gtp</code>
 * <code>Rectangle</code> instances.
 */
export interface RectangularData {
	x: number;
	y: number;
	w: number;
	h: number;
}

/**
 * A class that represents rectangular data that also provides utility methods useful for games - intersection,
 * etc.
 */
export default class Rectangle implements RectangularData {

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
	 * Returns whether a point is contained in this rectangle.
	 * @param {number} x The x-coordinate of the point.
	 * @param {number} y The y-coordinate of the point.
	 * @returns {boolean} Whether the point is contained in this rectangle.
	 */
	contains(x: number, y: number): boolean {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}

	/**
	 * Returns whether one rectangle contains another.
	 *
	 * @param {number|RectangularData} x2 Either rectangular data, or the
	 *        x-coordinate of the second rectangle.
	 * @param {number} y2 The y-coordinate of the second rectangle, if
	 *        specifying the dimensions as separate arguments.
	 * @param {number} w2 The width of the second rectangle, if
	 *        specifying the dimensions as separate arguments.
	 * @param {number} h2 The height of the second rectangle, if
	 *        specifying the dimensions as separate arguments.
	 * @return Whether this rectangle contains the specified rectangle.
	 */
	containsRect(x2: number | RectangularData, y2: number = 0, w2: number = 0, h2: number = 0): boolean {

		if (typeof x2 !== 'number') {
			const r: RectangularData = x2 as RectangularData;
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
		w2 += x2 as number;
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
	 * @param {RectangularData} rect2 Another rectangular data to compare against.
	 *        This should not be <code>null</code>.
	 * @return {boolean} Whether the two rectangles intersect.
	 */
	intersects(rect2: RectangularData): boolean {

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
	 * @param {number|RectangularData} x Either the new x-coordinate, or rectangular data.
	 * @param {number} y The new y-coordinate, if the first argument is a number.  If the first argument is a number
	 *        and this parameter is not specified, the current y value is preserved.
	 * @param {number} w The new width, if the first argument is a number.  If the first argument is a number and
	 *        this parameter is not specified, the current width value is preserved.
	 * @param {number} h The new height, if the first argument is a number.  If the first argument is a number and
	 *        this parameter is not specified, the current height value is preserved.
	 */
	set(x: number | RectangularData, y?: number, w?: number, h?: number) {
		if (typeof x === 'number') {
			this.x = x;
			if (y != null) {
				this.y = y;
			}
			if (w != null) {
				this.w = w;
			}
			if (h != null) {
				this.h = h;
			}
		}
		else {
			this.x = x.x;
			this.y = x.y;
			this.w = x.w;
			this.h = x.h;
		}
	}
}
