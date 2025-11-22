/**
 * A function that modifies a file path (for example, prepends a root directory to it).
 */
import TiledProperty from './TiledProperty.js';
import TiledLayer from './TiledLayer.js';

export type TiledImagePathModifier = (path: string) => string;

export function scaleTileset(tileset: TiledTileset, scale: number) {
	tileset.imagewidth *= scale;
	tileset.imageheight *= scale;
	tileset.tilewidth *= scale;
	tileset.tileheight *= scale;
	tileset.margin *= scale;
	tileset.spacing *= scale;
}

/**
 * A tile set used in a <code>Tiled</code> map. Note all fields are
 * optional because typically in a map file, a tileset entry will
 * only reference a tileset JSON file via <code>firstgid</code> and
 * <code>source</code>.
 */
export default interface TiledTileset {

	backgroundcolor?: string;
	columns?: number;
	firstgid: number;
	grid?: TiledTilesetGrid;
	image: string;
	imageheight: number;
	imagewidth: number;
	margin: number;
	name?: string;
	objectalignment?: 'unspecified' | 'topleft' | 'top' | 'topright' | 'left' | 'center' | 'right' | 'bottomleft' | 'bottom' | 'bottomright';
	properties?: TiledProperty[];
	source?: string;
	spacing: number;
	terrains?: TiledTilesetTerrain[];
	tilecount?: number;
	tiledversion?: string;
	tileheight: number;
	tileoffset?: TiledTileOffset;
	tiles?: TiledTilesetTile[];
	tilewidth: number;
	transforms?: TiledTilesetTransformations;
	transparentcolor?: string;
	type?: 'tileset';
	version?: string; // string since 1.6, number prior to that
	wangsets?: TiledWangSet[];
}

export interface TiledTilesetGrid {
	height: number;
	orientation: 'orthogonal' | 'isometric';
	width: number;
}

export interface TiledTileOffset {
	x: number;
	y: number;
}

/**
 * This element is used to describe which transformations can be applied to the tiles (e.g. to extend a Wang
 * set by transforming existing tiles).
 */
export interface TiledTilesetTransformations {

	/**
	 * Whether this tileset's tiles can be flipped horizontally.
	 */
	hflip: boolean;

	/**
	 * Whether this tileset's tiles can be flipped vertically.
	 */
	vflip: boolean;

	/**
	 * Whether this tileset's tiles can be rotated in 90 degree implements.
	 */
	rotate: boolean;

	/**
	 * Whether untransformed tiles remain preferred, otherwise transformed tiles are used to produce
	 * more variations.
	 */
	preferuntransformed: boolean;
}

export interface TiledTilesetTile {
	animation: TiledTilesetTileFrame[];
	id: number;
	image?: string;
	imageheight: number;
	imagewidth: number;
	/**
	 * Layer with type "objectgroup", when collision shapes are specified.
	 */
	objectgroup?: TiledLayer;
	probability?: number;
	properties: TiledProperty[];
	terrain?: number;
	type?: string;
}

export interface TiledTilesetTileFrame {

	/**
	 * Frame duration in milliseconds.
	 */
	duration: number;

	/**
	 * Local tile ID representing this frame.
	 */
	tileid: number;
}

export interface TiledTilesetTerrain {
	name: string;
	properties: TiledProperty[];
	tile: number;
}

export interface TiledWangSet {
	colors: TiledWangColor[];
	name: string;
	properties: TiledProperty[];

	/**
	 * Local ID of tile representing the Wang set.
	 */
	tile: number;

	type: 'corner' | 'edge' | 'mixed';

	wangtiles: TiledWangTile[];
}

export interface TiledWangColor {
	color: string;
	name: string;
	probability: number;
	properties: TiledProperty[];

	/**
	 * Local ID of tile representing the Wang color.
	 */
	tile: number;
}

export interface TiledWangTile {
	tileid: number;
	wangid: number[];
}
