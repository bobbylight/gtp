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
		 * @param {int} [x=0] The x-coordinate.
		 * @param {int} [y=0] The y-coordinate.
		 * @param {int} [w=0] The width of the rectangle.
		 * @param {int} [h=0] The height of the rectangle.
		 */
		constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
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
			console.log(rx, ry, rw, rh, tx, ty, tw, th);
			//      overflow || intersect
			return ((rw < rx || rw > tx) &&
				(rh < ry || rh > ty) &&
				(tw < tx || tw > rx) &&
				(th < ty || th > ry));
		}
	}
}