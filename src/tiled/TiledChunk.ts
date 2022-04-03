/**
 * Tiled chunks are used to store the tile layer data in infinite maps.
 */
export interface TiledChunk {

	/**
	 * Array of unsigned ints (GIDs) or base64-encoded data.
	 */
	data: number[] | string;

	/**
	 * Height in tiles.
	 */
	height: number;

	/**
	 * Width in tiles.
	 */
	width: number;

	/**
	 * X-coordinate in tiles.
	 */
	x: number;

	/**
	 * Y-coordinate in tiles.
	 */
	y: number;
}
