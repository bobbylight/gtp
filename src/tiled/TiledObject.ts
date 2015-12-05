interface Window {
	game: any;
}

module tiled {
	'use strict';

	export class TiledObject {

		gid: number;
		x: number;
		y: number;
		width: number;
		height: number;
		properties: { };

		constructor(data: any) {
			gtp.Utils.mixin(data, this);
			this.properties = this.properties || {};
			this.gid = this.gid || -1;

			// TODO: Remove
			var game: gtp.Game = window.game;
			this.x *= game._scale;
			this.y  *= game._scale;
			this.width *= game._scale;
			this.height *= game._scale;
		}

		intersects(ox: number, oy: number, ow: number, oh: number) {
			'use strict';
			//console.log(this.name + ": " + ox + ',' + oy + ',' + ow + ',' + oh + ' -> ' + this.x + ',' + this.y + ',' + this.width + ',' + this.height);
			var tw = this.width;
			var th = this.height;
			var rw = ow;
			var rh = oh;
			if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
				return false;
			}
			var tx = this.x;
			var ty = this.y;
			var rx = ox;
			var ry = oy;
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
	}
}