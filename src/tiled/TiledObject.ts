import TiledProperty from './TiledProperty';
import TiledPropertiesContainer from './TiledPropertiesContainer';

export function scaleObject(object: TiledObject, scale: number) {
	object.x *= scale;
	object.y *= scale;
	object.width *= scale;
	object.height *= scale;
}

export function intersects(object: TiledObject, ox: number, oy: number, ow: number, oh: number) {
	//console.log(this.name + ": " + ox + ',' + oy + ',' + ow + ',' + oh +
	//      ' -> ' + this.x + ',' + this.y + ',' + this.width + ',' + this.height);
	let tw: number = object.width;
	let th: number = object.height;
	let rw: number = ow;
	let rh: number = oh;
	if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
		return false;
	}
	const tx: number = object.x;
	const ty: number = object.y;
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

/**
 * An object in a <code>Tiled</code> map.
 */
export default interface TiledObject extends TiledPropertiesContainer {

	readonly ellipse: boolean;
	readonly gid: number;
	height: number;
	readonly id: number;
	readonly name: string;
	point: boolean;
	polygon?: TiledPoint[];
	polyline?: TiledPoint[];
	properties?: TiledProperty[];
	propertiesByName: Map<String, TiledProperty>;
	rotation: number;
	template: string;
	text?: TiledText;
	type: string;
	visible: boolean;
	width: number;
	x: number;
	y: number;
}

export interface TiledPoint {
	x: number;
	y: number;
}

export interface TiledText {
	bold: boolean;
	color: string;
	fontfamily: string;
	halign: string;
	italic: boolean;
	kerning: boolean;
	pixelsize: number;
	strikeout: boolean;
	text: string;
	underline: boolean;
	valign: string;
	wrap: boolean;
}
