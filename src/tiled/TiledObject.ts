import Game from '../gtp/Game';
import { Window } from '../gtp/GtpBase';
import TiledProperty, { TiledPropertyType } from './TiledProperty';
import { TypedMap } from '../gtp/TypedMap';

/**
 * An object in a <code>Tiled</code> map.
 */
export default class TiledObject {

	readonly gid!: number;
	readonly name!: string;
	x!: number;
	y!: number;
	width!: number;
	height!: number;
	type!: string;
	visible!: boolean;
	readonly properties: TiledProperty[];
	readonly propertiesByName: TypedMap<TiledProperty>;

	constructor(data: any) {

		this.gid = data.gid || -1;
		this.name = data.name;
		this.x = data.x || 0;
		this.y = data.y || 0;
		this.width = data.width || 0;
		this.height = data.height || 0;
		this.type = data.type;
		this.visible = typeof data.visible === 'undefined' ? true : data.visible;
		this.properties = data.properties || [];

		// TODO: Remove
		const gameWindow: Window = window as any;
		const game: Game = gameWindow.game;
		this.x *= game.scale;
		this.y *= game.scale;
		this.width *= game.scale;
		this.height *= game.scale;

		this.propertiesByName = {};
		this.properties.forEach((property: TiledProperty) => {
			this.propertiesByName[property.name] = property;
		});
	}

	getProperty<T extends TiledPropertyType>(name: string): T | null {
		return this.propertiesByName[name] ? this.propertiesByName[name].value as T : null;
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
