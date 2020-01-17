import TiledTileset, { ImagePathModifier } from './TiledTileset';
import TiledLayer from './TiledLayer';
import Image from '../gtp/Image';
import Game from '../gtp/Game';
import { Window } from '../gtp/GtpBase';
import TiledProperty, { TiledPropertyType } from './TiledProperty';
import { TypedMap } from '../gtp/TypedMap';

/**
 * A <code>Tiled</code> map.
 */
export default class TiledMap {

	rowCount: number;
	colCount: number;
	tileWidth: number;
	tileHeight: number;
	screenWidth: number;
	screenHeight: number;
	screenRows: number;
	screenCols: number;
	layers: TiledLayer[];
	layersByName: TypedMap<TiledLayer>;
	objectGroups: TiledLayer[];
	tilesets: TiledTileset[];
	readonly properties: TiledProperty[];
	readonly propertiesByName: TypedMap<TiledProperty>;
	version: number;
	orientation: string;

	/**
	 * A 2d game map, generated in Tiled.
	 */
	constructor(data: any, args: any) {

		// tslint:disable
		this.rowCount = data.height;
		this.colCount = data.width;
		this.tileWidth = args.tileWidth;
		this.tileHeight = args.tileHeight;
		this.screenWidth = args.screenWidth;
		this.screenHeight = args.screenHeight;
		this.screenRows = Math.ceil(this.screenHeight / this.tileHeight);
		this.screenCols = Math.ceil(this.screenWidth / this.tileWidth);
		const imagePathModifier: ImagePathModifier = args ? args.imagePathModifier : null;

		this.layers = [];
		this.layersByName = {};
		this.objectGroups = [];
		for (let i: number = 0; i < data.layers.length; i++) {
			this.addLayer(data.layers[i]);
		}

		this.tilesets = [];
		if (data.tilesets && data.tilesets.length) {
			for (let i: number = 0; i < data.tilesets.length; i++) {
				this.tilesets.push(new TiledTileset(data.tilesets[i], imagePathModifier));
			}
		}

		this.properties = data.properties || [];
		this.version = data.version;
		this.orientation = data.orientation;
		// tslint:enable

		this.propertiesByName = {};
		this.properties.forEach((property: TiledProperty) => {
			this.propertiesByName[property.name] = property;
		});
	}

	/**
	 * Adds a layer to this map.  This method is called internally by the library
	 * and the programmer typically does not need to call it.
	 *
	 * @param layerData The raw layer data.
	 * @method
	 */
	addLayer(layerData: any) {
		const layer: TiledLayer = new TiledLayer(this, layerData);
		this.layers.push(layer);
		this.layersByName[layer.name] = layer;
		if (layer.isObjectGroup()) {
			this.objectGroups.push(layer);
		}
	}

	draw(ctx: CanvasRenderingContext2D, centerRow: number, centerCol: number,
			dx: number = 0, dy: number = 0) {

		const colCount: number = this.colCount;
		const rowCount: number = this.rowCount;

		const screenCols: number = this.screenRows;
		const screenRows: number = this.screenCols;
		const tileW: number = this.tileWidth;
		const tileH: number = this.tileHeight;
		const tileSize: number = tileW; // Assumes square tiles (!).  Fix me one day
		const screenWidth: number = this.screenWidth;
		const screenHeight: number = this.screenHeight;

		let col0: number = centerCol - Math.floor(screenCols / 2);
		if (col0 < 0) {
			col0 += colCount;
		}
		let row0: number = centerRow - Math.floor(screenRows / 2);
		if (row0 < 0) {
			row0 += rowCount;
		}

		// Center point of screen, in map x,y coordinates.
		const cx: number = centerCol * tileW + dx + tileW / 2;
		const cy: number = centerRow * tileH + dy + tileH / 2;

		// Top-left of screen, in map x,y coordinates.
		const x0: number = cx - screenWidth / 2;
		const y0: number = cy - screenHeight / 2;

		let topLeftCol: number = Math.floor(x0 / tileW);
		if ((x0 % tileSize) < 0) {
			topLeftCol--;
		}
		const tileEdgeX: number = topLeftCol * tileW;

		let topLeftRow: number = Math.floor(y0 / tileH);
		if ((y0 % tileSize) < 0) { // e.g. is < 0 and not a multiple of tileSize
			topLeftRow--;
		}
		const tileEdgeY: number = topLeftRow * tileH; // getTileEdge(topLeftY);

		// The view coordinates at which to start painting.
		const startX: number = tileEdgeX - x0;
		let x: number = startX;
		const startY: number = tileEdgeY - y0;
		let y: number = startY;

		if (topLeftCol < 0) {
			topLeftCol += colCount;
		}
		if (topLeftRow < 0) {
			topLeftRow += rowCount;
		}

		// Paint until the end of the screen
		let row: number = topLeftRow;
		const layerCount: number = this.getLayerCount();
		while (y < screenHeight) {
			for (let l: number = 0; l < layerCount; l++) {

				let col: number = topLeftCol;
				x = startX;

				const layer: TiledLayer = this.getLayerByIndex(l);
				if (layer.visible) {

					let prevOpacity: number = 1; // Default value needed for strict null checks
					if (layer.opacity < 1) {
						prevOpacity = ctx.globalAlpha;
						ctx.globalAlpha = prevOpacity * layer.opacity;
					}

					while (x < screenWidth) {
						const value: number = layer.getData(row % rowCount, col % colCount);
						this.drawTile(ctx, x, y, value, layer);
						x += tileW;
						col++;
					}

					if (layer.opacity < 1) {
						ctx.globalAlpha = prevOpacity;
					}

				}

				// Here we could render sprites in-between layers
			}

			y += tileH;
			row++;
		}
	}

	/**
	 * Returns a layer by name.
	 *
	 * @param name The name of the layer.
	 * @return The layer, or null if there is no layer with that name.
	 * @method
	 */
	getLayer(name: string): TiledLayer {
		return this.layersByName[name];
	}

	/**
	 * Returns a layer by index.
	 *
	 * @param index The index of the layer.
	 * @return The layer, or null if there is no layer at
	 *         that index.
	 * @method
	 */
	getLayerByIndex(index: number): TiledLayer {
		return this.layers[index];
	}

	/**
	 * Returns the number of layers in this map.
	 *
	 * @return The number of layers in this map.
	 */
	getLayerCount(): number {
		return this.layers.length;
	}

	private _getImageForGid(gid: number): TiledTileset {
		const tilesetCount: number = this.tilesets.length;
		for (let i: number = 0; i < tilesetCount; i++) {
			if (this.tilesets[i].firstgid > gid) {
				return this.tilesets[i - 1];
			}
		}
		return this.tilesets[tilesetCount - 1];
	}

	getProperty<T extends TiledPropertyType>(name: string): T | null {
		return this.propertiesByName[name] ? this.propertiesByName[name].value as T : null;
	}

	drawTile(ctx: CanvasRenderingContext2D, x: number, y: number,
			value: number, layer: TiledLayer) {

		if (value <= 0) { // 0 => no tile to draw
			return;
		}

		const tileset: TiledTileset = this._getImageForGid(value);
		if (!tileset) {
			console.log(`null tileset for: ${value} (layer ${layer.name})`);
			return;
		}

		value -= tileset.firstgid;
		if (value < 0) {
			return;
		}

		const gameWindow: Window = window as any;
		const game: Game = gameWindow.game;
		const img: Image = game.assets.getTmxTilesetImage(tileset);

		const tileW: number = this.tileWidth;
		const sw: number = tileW + tileset.spacing;
		const tileH: number = this.tileHeight;
		const sh: number = tileH + tileset.spacing;

		// TODO: "+ 1" is based on extra space at end of image.  Should be configured/calculated
		let imgColCount: number = Math.floor(img.width / sw);
		if (tileset.spacing > 0 && ((img.width % sw) === tileW)) {
			imgColCount++;
		}
		const imgY: number = Math.floor(value / imgColCount) * sh;
		const imgX: number = (value % imgColCount) * sw;

		//ctx.drawImage(img, imgX,imgY,tileW,tileH, x,y,tileW,tileH);
		img.drawScaled2(ctx, imgX, imgY, tileW, tileH, x, y, tileW, tileH);

	}

	setScale(scale: number) {
		this.tileWidth *= scale;
		this.tileHeight *= scale;
		this.screenRows = Math.ceil(this.screenHeight / this.tileHeight);
		this.screenCols = Math.ceil(this.screenWidth / this.tileWidth);
		const tilesetCount: number = this.tilesets.length;
		for (let i: number = 0; i < tilesetCount; i++) {
			this.tilesets[i].setScale(scale);
		}
	}

	/**
	 * Returns the pixel width of this map.
	 *
	 * @return The pixel width of this map.
	 * @method
	 */
	getPixelWidth(): number {
		return this.colCount * this.tileWidth;
	}

	/**
	 * Returns the pixel height of this map.
	 *
	 * @return The pixel height of this map.
	 * @method
	 */
	getPixelHeight(): number {
		return this.rowCount * this.tileHeight;
	}

	/**
	 * Removes a layer from this map.
	 * @param layerName The name of the layer to remove.
	 * @return Whether a layer by that name was found.
	 * @method
	 */
	removeLayer(layerName: string): boolean {
		for (let i: number = 0; i < this.layers.length; i++) {
			if (this.layers[i].name === layerName) {
				this.layers.splice(i, 1);
				delete this.layersByName[layerName];
				for (let j: number = 0; j < this.objectGroups.length; j++) {
					if (this.objectGroups[j].name === layerName) {
						delete this.objectGroups[j];
					}
				}
			}
			return true;
		}
		return false;
	}
}
