module gtp {
	'use strict';

	export class Rectangle {

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
		 * Returns whether this rectangle intersects another.
		 *
		 * @param {gtp.Rectangle} rect2 Another rectangle to compare against.
		 *        This should not be null.
		 * @return {boolean} Whether the two rectangles intersect.
		 */
		intersects(rect2: gtp.Rectangle): boolean {

			var tw: number = this.w;
			var th: number = this.h;
			var rw: number = rect2.w;
			var rh: number = rect2.h;
			if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
				return false;
			}
			var tx: number = this.x;
			var ty: number = this.y;
			var rx: number = rect2.x;
			var ry: number = rect2.y;
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
}
