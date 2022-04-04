import TiledObject, { intersects } from './TiledObject';
import TiledMap from './TiledMap';
import { TiledLayerData } from './TiledLayerData';
import TiledProperty, { TiledPropertyType } from './TiledProperty';
import { TiledChunk } from './TiledChunk';
import TiledPropertiesContainer, { getProperty, initPropertiesByName } from './TiledPropertiesContainer';

/**
 * A layer in a <code>Tiled</code> map, along with a few utility
 * methods useful for games.
 */
export default class TiledLayer implements TiledLayerData, TiledPropertiesContainer {

	chunks?: TiledChunk[];
	compression?: 'zlib' | 'gzip' | 'zstd';
	data?: number[] | string;
	draworder?: 'topdown' | 'index';
	encoding?: 'csv' | 'base64';
	height: number;
	id: number;
	image?: string;
	layer?: TiledLayerData[];
	locked?: boolean;
	name: string;
	objects?: TiledObject[];
	offsetx?: number;
	offsety?: number;
	opacity: number;
	parallaxx?: number;
	parallaxy?: number;
	properties?: TiledProperty[];
	repeatx?: boolean;
	repeaty?: boolean;
	startx?: number;
	starty?: number;
	tintcolor?: string;
	transparentcolor?: string;
	type: 'tilelayer' | 'objectgroup' | 'imagelayer' | 'group';
	visible: boolean;
	width: number;
	x: number;
	y: number;

	map: TiledMap;
	propertiesByName!: Map<String, TiledProperty>;
	objectsByName?: Map<String, TiledObject>;

	constructor(map: TiledMap, data: TiledLayerData) {

		// Standard Tiled map properties for a layer
		this.chunks = data.chunks;
		this.compression = data.compression;
		this.data = data.data;
		this.draworder = data.draworder;
		this.encoding = data.encoding;
		this.height = data.height;
		this.id = data.id;
		this.image = data.image;
		this.layer = data.layer;
		this.locked = data.locked;
		this.name = data.name;
		this.setObjects(data.objects);
		this.offsetx = data.offsetx;
		this.offsety = data.offsety;
		this.opacity = data.opacity;
		this.parallaxx = data.parallaxx;
		this.parallaxy = data.parallaxy;
		this.properties = data.properties;
		this.repeatx = data.repeatx;
		this.repeaty = data.repeaty;
		this.startx = data.startx;
		this.starty = data.starty;
		this.tintcolor = data.tintcolor;
		this.transparentcolor = data.transparentcolor;
		this.type = data.type;
		this.visible = data.visible;
		this.width = data.width;
		this.x = data.x;
		this.y = data.y;

		// Properties we've added for convenience
		this.map = map;
		initPropertiesByName(this);
	}

	getData(row: number, col: number): number {
		if (!this.data) { // An object layer
			return -1;
		}
		const index: number = this._getIndex(row, col);
		return this.data[index] as number; // We currently only support numeric data
	}

	setData(row: number, col: number, value: number): boolean {
		if (!this.data) { // An object layer
			return false;
		}
		const index: number = this._getIndex(row, col);
		(this.data as number[])[index] = value; // We currently only support numeric data
		return true;
	}

	private _getIndex(row: number, col: number): number {
		return row * this.width + col;
	}

	getObjectByName(name: string): TiledObject | undefined {
		return this.objectsByName ? this.objectsByName.get(name) : undefined;
	}

	getObjectIntersecting(x: number, y: number, w: number, h: number): TiledObject | undefined {
		return this.objects?.find(obj => intersects(obj, x, y, w, h));
	}

	/**
	 * A utility method to fetch a property from this map.
	 * This is a convenience method for <code>layer.propertiesByName.get(name)!</code>.
	 * An error is thrown if the property does not exist.
	 *
	 * @param name The name of the property to retrieve.
	 * @return The property's value.
	 * @method
	 */
	getProperty<T extends TiledPropertyType>(name: string): T {
		return getProperty(this, name);
	}

	isObjectGroup(): boolean {
		return 'objectgroup' === this.type;
	}

	private setObjects(objects?: TiledObject[]) {
		if (objects) {
			this.objects = [];
			this.objectsByName = new Map<String, TiledObject>();

			objects.forEach(object => {
				initPropertiesByName(object);
				this.objects!.push(object);
				this.objectsByName!.set(object.name, object);
			});
		}
	}

}
