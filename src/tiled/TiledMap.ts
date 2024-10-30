import TiledTileset, { scaleTileset, TiledImagePathModifier } from './TiledTileset';
import Image from '../gtp/Image';
import Game from '../gtp/Game';
import {Window} from '../gtp/GtpBase';
import TiledProperty from './TiledProperty';
import { TiledMapData } from './TiledMapData';
import { TiledMapArgs } from './TiledMapArgs';
import { TiledLayerData } from './TiledLayerData';
import TiledLayer from './TiledLayer';
import TiledPropertiesContainer, { getProperty, initPropertiesByName } from './TiledPropertiesContainer';
import { scaleObject } from './TiledObject';

/**
 * A <code>Tiled</code> map.
 */
export default class TiledMap implements TiledMapData, TiledPropertiesContainer {

	backgroundcolor?: string;
	compressionlevel: number;
	height: number;
	hexsidelength?: number;
	infinite: boolean;
	layers: TiledLayer[];
	nextlayerid: number;
	nextobjectid: number;
	orientation: 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';
	parallaxoriginx?: number;
	parallaxoriginy?: number;
	properties?: TiledProperty[];
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

	screenWidth: number;
	screenHeight: number;
	screenRows: number;
	screenCols: number;
	layersByName: Map<string, TiledLayer>;
	objectGroups: TiledLayer[];
	propertiesByName!: Map<string, TiledProperty>;

	/**
	 * A 2d game map, generated in Tiled.
	 */
	constructor(data: TiledMapData, args: TiledMapArgs) {

		// Standard Tiled map properties
		this.backgroundcolor = data.backgroundcolor;
		this.compressionlevel = data.compressionlevel;
		this.height = data.height;
		this.hexsidelength = data.hexsidelength;
		this.infinite = data.infinite;
		this.layers = data.layers.map(layer => new TiledLayer(this, layer));
		this.nextlayerid = data.nextlayerid;
		this.nextobjectid = data.nextobjectid;
		this.orientation = data.orientation;
		this.parallaxoriginx = data.parallaxoriginx;
		this.parallaxoriginy = data.parallaxoriginy;
		this.properties = data.properties;
		this.renderorder = data.renderorder;
		this.staggeraxis = data.staggeraxis;
		this.staggerindex = data.staggerindex;
		this.tiledversion = data.tiledversion;
		this.tileheight = data.tileheight;
		this.tilesets = data.tilesets;
		this.tilewidth = data.tilewidth;
		this.type = data.type;
		this.version = data.version;
		this.width = data.width;

		// Properties we've added for convenience
		this.screenWidth = args.screenWidth;
		this.screenHeight = args.screenHeight;
		this.screenRows = Math.ceil(this.screenHeight / this.tileheight);
		this.screenCols = Math.ceil(this.screenWidth / this.tilewidth);
		const imagePathModifier: TiledImagePathModifier | undefined = args.imagePathModifier;

		this.tilesets = data.tilesets.map(tileset => {
			// Newer Tiled versions reference most tileset data in external JSON
			// files via a "source" property. Sniff that out and inline all tileset
			// data into the map for simplicity.
			if (tileset.source) {
				// Preserve "firstgid", and any other properties that might be in original
				Object.assign(tileset, args.assets.get(tileset.source));
			}
			if (imagePathModifier) {
				tileset.image = imagePathModifier(tileset.image);
			}
			return tileset;
		});

		this.layersByName = new Map<string, TiledLayer>();
		this.objectGroups = [];
		this.layers.forEach(layer => {
			this.layersByName.set(layer.name, layer);
			if (layer.isObjectGroup()) {
				this.objectGroups.push(layer);
			}
		});

		initPropertiesByName(this);
	}

	draw(ctx: CanvasRenderingContext2D, centerRow: number, centerCol: number,
			dx: number = 0, dy: number = 0) {

		const colCount: number = this.width;
		const rowCount: number = this.height;

		const screenCols: number = this.screenRows;
		const screenRows: number = this.screenCols;
		const tileW: number = this.tilewidth;
		const tileH: number = this.tileheight;
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
		while (y < screenHeight) {
			this.layers.forEach(layer => {

				let col: number = topLeftCol;
				x = startX;

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
			});

			y += tileH;
			row++;
		}
	}

	drawTile(ctx: CanvasRenderingContext2D, x: number, y: number,
			value: number, layer: TiledLayerData) {

		if (value <= 0) { // 0 => no tile to draw
			return;
		}

		const tileset: TiledTileset = this.getTilesetForGid(value);
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

		const tileW: number = this.tilewidth;
		const sw: number = tileW + tileset.spacing;
		const tileH: number = this.tileheight;
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

	/**
	 * Returns a layer by name. Throws an error if the layer does not exist.
	 *
	 * @param name The name of the layer.
	 * @return The layer.
	 * @method
	 */
	getLayer(name: string): TiledLayer {
		const layer = this.layersByName.get(name);
		if (!layer) {
			throw new Error(`No such layer: ${name}`);
		}
		return layer;
	}

	/**
	 * Returns a layer by name.
	 *
	 * @param name The layer to return.
	 * @return The layer, or <code>undefined</code> if it does not exist.
	 * @method
	 */
	getLayerIfExists(name: string): TiledLayer | undefined {
		return this.layersByName.get(name);
	}

	/**
	 * Returns a layer by index.
	 *
	 * @param index The index of the layer.
	 * @return The layer, or undefined if there is no layer at
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

	/**
	 * Returns the pixel height of this map.
	 *
	 * @return The pixel height of this map.
	 * @method
	 */
	getPixelHeight(): number {
		return this.height * this.tileheight;
	}

	/**
	 * Returns the pixel width of this map.
	 *
	 * @return The pixel width of this map.
	 * @method
	 */
	getPixelWidth(): number {
		return this.width * this.tilewidth;
	}

	/**
	 * A utility method to fetch a property from this map.
	 * This is a convenience method for <code>layer.propertiesByName.get(name)!</code>.
	 * An error is thrown if the property does not exist and no default is specified.
	 *
	 * @param name The name of the property to retrieve.
	 * @param defaultValue The default value to return if the property does not exist,
	 *        or omitted or <code>undefined</code>.
	 * @return The property's value.
	 * @method
	 */
	getProperty<T>(name: string, defaultValue?: T): T {
		return getProperty(this, name, defaultValue);
	}

	private getTilesetForGid(gid: number): TiledTileset {
		const tilesetCount: number = this.tilesets.length;
		for (let i: number = 0; i < tilesetCount; i++) {
			if (this.tilesets[i].firstgid > gid) {
				return this.tilesets[i - 1];
			}
		}
		return this.tilesets[tilesetCount - 1];
	}

	/**
	 * Removes a layer from this map. This should be called instead of
	 * manually manipulating the <code>layers</code> property directly
	 * to ensure <code>layersByName</code> and <objectGroups</code>
	 * stay in sync.
	 *
	 * @param layerName The name of the layer to remove.
	 * @return Whether a layer by that name was found.
	 * @method
	 */
	removeLayer(layerName: string): boolean {
		for (let i: number = 0; i < this.layers.length; i++) {
			if (this.layers[i].name === layerName) {
				this.layers.splice(i, 1);
				this.layersByName.delete(layerName);
				for (let j: number = 0; j < this.objectGroups.length; j++) {
					if (this.objectGroups[j].name === layerName) {
						delete this.objectGroups[j];
					}
				}
				return true;
			}
		}
		return false;
	}

	setScale(scale: number) {
		this.tilewidth *= scale;
		this.tileheight *= scale;
		this.screenRows = Math.ceil(this.screenHeight / this.tileheight);
		this.screenCols = Math.ceil(this.screenWidth / this.tilewidth);
		// Unnecessary curly braces in fat arrow functions required by eslint
		this.layers.forEach(layer => {
			layer.objects?.forEach(object => { scaleObject(object, scale) });
		});
		this.tilesets.forEach(tileset => { scaleTileset(tileset, scale) });
	}
}
