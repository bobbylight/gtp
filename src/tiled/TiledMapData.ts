import TiledProperty from './TiledProperty';
import TiledTileset from './TiledTileset';
import { TiledLayerData } from './TiledLayerData';

/**
 * The data stored by Tiled for a <code>TiledMap</code>.
 */
export interface TiledMapData {

	backgroundcolor?: string;

	/**
	 * The compression level to use for tile layer data (defaults to
	 * -1, which means to use the algorithm default).
	 */
	compressionlevel: number;

	height: number;
	hexsidelength?: number;
	infinite: boolean;
	layers: TiledLayerData[];
	nextlayerid: number;
	nextobjectid: number;
	orientation: 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';
	parallaxoriginx?: number;
	parallaxoriginy?: number;
	properties?: TiledProperty[];

	/**
	 * Currently only supported for othogonal maps. <code>right-down</code>
	 * is the default.
	 */
	renderorder: 'right-down' | 'right-up' | 'left-down' | 'left-up';
	staggeraxis?: 'x' | 'y';
	staggerindex?: 'odd' | 'even';
	tiledversion: string;
	tileheight: number;
	tilesets: TiledTileset[];
	tilewidth: number;
	type: 'map';
	version: string;
	width: number;
}
