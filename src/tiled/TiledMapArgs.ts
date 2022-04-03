import { TiledImagePathModifier } from './TiledTileset';
import AssetLoader from '../gtp/AssetLoader';

/**
 * Extra arguments to a <code>TiledMap</code>.
 */
export interface TiledMapArgs {
    screenWidth: number;
    screenHeight: number;
    imagePathModifier?: TiledImagePathModifier;
	assets: AssetLoader;
}
