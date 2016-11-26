import {Game} from '../gtp/Game';
import {Utils} from '../gtp/Utils';
import {Window} from '../gtp/GtpBase';

export class TiledObject {

	gid: number;
	x: number;
	y: number;
	width: number;
	height: number;
	properties: { };

	constructor(data: any) {
		Utils.mixin(data, this);
		this.properties = this.properties || {};
		this.gid = this.gid || -1;

		// TODO: Remove
		const gameWindow: Window = <any>window;
		const game: Game = gameWindow.game;
		this.x *= game._scale;
		this.y  *= game._scale;
		this.width *= game._scale;
		this.height *= game._scale;
	}

	intersects(ox: number, oy: number, ow: number, oh: number) {
		'use strict';
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
