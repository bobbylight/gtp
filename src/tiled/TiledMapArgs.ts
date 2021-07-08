import {ImagePathModifier} from './TiledTileset';

/**
 * Extra arguments to a <code>TiledMap</code>.
 */
export interface TiledMapArgs {
    tileWidth: number;
    tileHeight: number;
    screenWidth: number;
    screenHeight: number;
    imagePathModifier?: ImagePathModifier;
}
