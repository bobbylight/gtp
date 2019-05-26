import Game from '../gtp/Game';
import { Window } from '../gtp/GtpBase';

/**
 * An object in a <code>Tiled</code> map.
 */
export default class TiledObject {

	gid!: number;
	name!: string;
	x!: number;
	y!: number;
	width!: number;
	height!: number;
	type!: string;
	visible!: boolean;
	properties: any;

	constructor(data: any) {

		this.gid = data.gid || -1;
		this.name = data.name;
		this.x = data.x || 0;
		this.y = data.y || 0;
		this.width = data.width || 0;
		this.height = data.height || 0;
		this.type = data.type;
		this.visible = typeof data.visible === 'undefined' ? true : data.visible;
		this.properties = data.properties || {};

		// TODO: Remove
		const gameWindow: Window = window as any;
		const game: Game = gameWindow.game;
		this.x *= game._scale;
		this.y *= game._scale;
		this.width *= game._scale;
		this.height *= game._scale;
	}

	intersects(ox: number, oy: number, ow: number, oh: number) {
		//console.log(this.name + ": " + ox + ',' + oy + ',' + ow + ',' + oh +
		//      ' -> ' + this.x + ',' + this.y + ',' + this.width + ',' + this.height);
		let tw: number = this.width;
		let th: number = this.height;
		let rw: number = ow;
		let rh: number = oh;
		if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
			return false;
		}
		const tx: number = this.x;
		const ty: number = this.y;
		const rx: number = ox;
		const ry: number = oy;
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
