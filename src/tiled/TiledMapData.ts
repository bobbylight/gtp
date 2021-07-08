import TiledProperty from './TiledProperty';

/**
 * The data stored by Tiled for a <code>TiledMap</code>.
 */
export interface TiledMapData {
	width: number;
	height: number;
	layers: any[];
	tilesets?: any[];
	properties?: TiledProperty[];
	version: number;
	orientation: string;
}
