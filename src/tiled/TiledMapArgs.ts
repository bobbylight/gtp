import AssetLoader from '../gtp/AssetLoader';
import { TiledImagePathModifier } from './TiledTileset';

/**
 * Extra arguments to a <code>TiledMap</code>.
 */
export interface TiledMapArgs {
	screenWidth: number;
	screenHeight: number;
	imagePathModifier?: TiledImagePathModifier;
	assets: AssetLoader;
}
