import TiledObject from './TiledObject';
import TiledProperty from './TiledProperty';
import { TiledChunk } from './TiledChunk';

/**
 * A layer in a <code>Tiled</code> map.
 */
export interface TiledLayerData {

	/**
	 * Optional array of chunks. <code>tilelayer</code> only.
	 */
	chunks?: TiledChunk[];

	/**
	 * Empty is the default.
	 */
	compression?: 'zlib' | 'gzip' | 'zstd';

	/**
	 * An array of unsigned ints (GID) or base64-encoded data.
	 */
	data: number[] | string;

	/**
	 * <code>topdown</code> is the default.  Only used in
	 * <code>objectgroup</code> layers.
	 */
	draworder?: 'topdown' | 'index';

	/**
	 * <code>csv</code> is the defalut. Only used in <code>tilelayer</code> layers.
	 */
	encoding?: 'csv' | 'base64';

	/**
	 * Row count. Same as map height for fixed-size maps.
	 */
	height: number;

	/**
	 * Incremental ID - unique across all layers.
	 */
	id: number;

	/**
	 * The image used by this layer. <code>imagelayer</code> only.
	 */
	image?: string;

	/**
	 * Array of child layers. <code>group</code> only.
	 */
	layer?: TiledLayerData[];

	/**
	 * Whether this layer is locked in the editor. Default is <code>false</code>.
	 */
	locked?: boolean;

	name: string;

	/**
	 * Array of objects. <code>objectgroup</code> only.
	 */
	objects?: TiledObject[];

	/**
	 * Horizontal offset in pixels. Default is <code>0</code>.
	 */
	offsetx?: number;

	/**
	 * Vertical offset in pixels. Default is <code>0</code>.
	 */
	offsety?: number;

	/**
	 * Value between 0 and 1.
	 */
	opacity: number;

	/**
	 * Horizontal parallax factor for this layer. Default is <code>1</code>.
	 */
	parallaxx?: number;

	/**
	 * Vertical parallax factor for this layer. Default is <code>1</code>.
	 */
	parallaxy?: number;

	/**
	 * Array of properties.
	 */
	properties?: TiledProperty[];

	/**
	 * Whether ths image drawn by this layer is repeated along the x-axis.
	 * <code>imagelayer</code> only.
	 */
	repeatx?: boolean;

	/**
	 * Whether ths image drawn by this layer is repeated along the y-axis.
	 * <code>imagelayer</code> only.
	 */
	repeaty?: boolean;

	/**
	 * X-coordinate where layer content starts (for infinite maps).
	 */
	startx?: number;

	/**
	 * Y-coordinate where layer content starts (for infinite maps).
	 */
	starty?: number;

	/**
	 * Hex-formatted tint color that is multiplied with any graphics drawn by this
	 * layer or any child layers.
	 */
	tintcolor?: string;

	/**
	 * Hex-formatted color. <code>imagelayer</code> only.
	 */
	transparentcolor?: string;

	type: 'tilelayer' | 'objectgroup' | 'imagelayer' | 'group';

	/**
	 * Whether this layer is shown or hidden in the editor.
	 */
	visible: boolean;

	/**
	 * Column count. Same as map width for fixed-size maps.
	 */
	width: number;

	/**
	 * Horizontal layer offset in tiles. Always 0.
	 */
	x: number;

	/**
	 * Vertical layer offset in tiles. Always 0.
	 */
	y: number;
}
