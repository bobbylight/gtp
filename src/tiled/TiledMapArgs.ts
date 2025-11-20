import AssetLoader from '../gtp/AssetLoader.js';
import { TiledImagePathModifier } from './TiledTileset.js';

/**
 * Extra arguments to a <code>TiledMap</code>.
 */
export interface TiledMapArgs {
	screenWidth: number;
	screenHeight: number;
	imagePathModifier?: TiledImagePathModifier;
	assets: AssetLoader;
}
