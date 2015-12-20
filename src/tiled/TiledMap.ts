module tiled {
	'use strict';

	export class TiledMap {

		rowCount: number;
		colCount: number;
		tileWidth: number;
		tileHeight: number;
		screenWidth: number;
		screenHeight: number;
		screenRows: number;
		screenCols: number;
		imagePathModifier: Function;
		layers: TiledLayer[];
		layersByName: { [name: string]: TiledLayer };
		objectGroups: TiledLayer[];
		tilesets: TiledTileset[];
		properties: any;
		version: number;
		orientation: string;

		/**
		 * A 2d game map, generated in Tiled.
		 * 
		 * @constructor
		 */
		constructor(data: any, args: any) {

			this.rowCount = data.height;
			this.colCount = data.width;
			this.tileWidth = args.tileWidth;
			this.tileHeight = args.tileHeight;
			this.screenWidth = args.screenWidth;
			this.screenHeight = args.screenHeight;
			this.screenRows = Math.ceil(this.screenHeight / this.tileHeight);
			this.screenCols = Math.ceil(this.screenWidth / this.tileWidth);
			let imagePathModifier: Function = args ? args.imagePathModifier : null;

			this.layers = [];
			this.layersByName = {};
			this.objectGroups = [];
			for (var i: number = 0; i < data.layers.length; i++) {
				this.addLayer(data.layers[i]);
			}

			this.tilesets = [];
			if (data.tilesets && data.tilesets.length) {
				for (i = 0; i < data.tilesets.length; i++) {
					this.tilesets.push(new tiled.TiledTileset(data.tilesets[i], imagePathModifier));
				}
			}

			this.properties = data.properties;
			this.version = data.version;
			this.orientation = data.orientation;
		}

		/**
		 * Adds a layer to this map.  This method is called internally by the library
		 * and the programmer typically does not need to call it.
		 * 
		 * @param {object} layerData The raw layer data.
		 * @method
		 */
		addLayer(layerData: any) {
			var layer: TiledLayer = new tiled.TiledLayer(this, layerData);
			this.layers.push(layer);
			this.layersByName[layer.name] = layer;
			if (layer.isObjectGroup()) {
				this.objectGroups.push(layer);
			}
		}
   
		draw(ctx: CanvasRenderingContext2D, centerRow: number, centerCol: number,
				dx: number = 0, dy: number = 0) {

			var colCount: number = this.colCount;
			var rowCount: number = this.rowCount;

			var screenCols: number = this.screenRows;
			var screenRows: number = this.screenCols;
			var tileW: number = this.tileWidth;
			var tileH: number = this.tileHeight;
			var tileSize: number = tileW; // Assumes square tiles (!).  Fix me one day
			var screenWidth: number = this.screenWidth;
			var screenHeight: number = this.screenHeight;

			var col0: number = centerCol - Math.floor(screenCols / 2);
			if (col0 < 0) {
				col0 += colCount;
			}
			var row0: number = centerRow - Math.floor(screenRows / 2);
			if (row0 < 0) {
				row0 += rowCount;
			}
      
			// Center point of screen, in map x,y coordinates.
			var cx: number = centerCol * tileW + dx + tileW / 2;
			var cy: number = centerRow * tileH + dy + tileH / 2;
      
			// Top-left of screen, in map x,y coordinates.
			var x0: number = cx - screenWidth / 2;
			var y0: number = cy - screenHeight / 2;

			var topLeftCol: number = Math.floor(x0 / tileW);
			if ((x0 % tileSize) < 0) {
				topLeftCol--;
			}
			var tileEdgeX: number = topLeftCol * tileW;

			var topLeftRow: number = Math.floor(y0 / tileH);
			if ((y0 % tileSize) < 0) { // e.g. is < 0 and not a multiple of tileSize
				topLeftRow--;
			}
			var tileEdgeY: number = topLeftRow * tileH; // getTileEdge(topLeftY);
      
			// The view coordinates at which to start painting.
			var startX: number = tileEdgeX - x0;
			var _x: number = startX;
			var startY: number = tileEdgeY - y0;
			var _y: number = startY;

			if (topLeftCol < 0) {
				topLeftCol += colCount;
			}
			if (topLeftRow < 0) {
				topLeftRow += rowCount;
			}
      
			// Paint until the end of the screen
			var row: number = topLeftRow;
			var layerCount: number = this.getLayerCount();
			var tileCount: number = 0;
			while (_y < screenHeight) {
				for (var l: number = 0; l < layerCount; l++) {

					var col: number = topLeftCol;
					_x = startX;

					var layer: TiledLayer = this.getLayerByIndex(l);
					if (layer.visible) {

						var prevOpacity: number;
						if (layer.opacity < 1) {
							prevOpacity = ctx.globalAlpha;
							ctx.globalAlpha = prevOpacity * layer.opacity;
						}

						while (_x < screenWidth) {
							var value: number = layer.getData(row % rowCount, col % colCount);
							this.drawTile(ctx, _x, _y, value, layer);
							tileCount++;
							_x += tileW;
							col++;
						}

						if (layer.opacity < 1) {
							ctx.globalAlpha = prevOpacity;
						}

					}
            
					// Here we could render sprites in-between layers
				}

				_y += tileH;
				row++;
			}
      
			//console.log('tileCount === ' + tileCount);
		}
   
		/**
		 * Returns a layer by name.
		 * 
		 * @param {string} name The name of the layer.
		 * @return {tiled.TiledLayer} The layer, or null if there is no layer with
		 *         that name.
		 * @method
		 */
		getLayer(name: string): TiledLayer {
			return this.layersByName[name];
		}
   
		/**
		 * Returns a layer by index.
		 * 
		 * @param {int} index The index of the layer.
		 * @return {tiled.TiledLayer} The layer, or null if there is no layer at
		 *         that index.
		 * @method
		 */
		getLayerByIndex(index: number): TiledLayer {
			return this.layers[index];
		}
   
		/**
		 * Returns the number of layers in this map.
		 * 
		 * @return {int} The number of layers in this map.
		 */
		getLayerCount(): number {
			return this.layers.length;
		}
   
		private _getImageForGid(gid: number): TiledTileset {
			var tilesetCount: number = this.tilesets.length;
			for (var i: number = 0; i < tilesetCount; i++) {
				if (this.tilesets[i].firstgid > gid) {
					return this.tilesets[i - 1];
				}
			}
			return this.tilesets[tilesetCount - 1];
		}
   
		drawTile(ctx: CanvasRenderingContext2D, x: number, y: number,
				value: number, layer: TiledLayer) {

			if (value <= 0) { // 0 => no tile to draw
				return;
			}

			var tileset: TiledTileset = this._getImageForGid(value);
			if (!tileset) {
				console.log('null tileset for: ' + value + ' (layer ' + layer.name + ')');
				return;
			}

			value -= tileset.firstgid;
			if (value < 0) {
				return;
			}

			var game: gtp.Game = window.game;
			var img: gtp.Image = game.assets.getTmxTilesetImage(tileset);

			var tileW: number = this.tileWidth;
			var sw: number = tileW + tileset.spacing;
			var tileH: number = this.tileHeight;
			var sh: number = tileH + tileset.spacing;
      
			// TODO: "+ 1" is based on extra space at end of image.  Should be configured/calculated
			var imgColCount: number = Math.floor(img.width / sw);
			if (tileset.spacing > 0 && ((img.width % sw) === tileW)) {
				imgColCount++;
			}
			var imgY: number = Math.floor(value / imgColCount) * sh;
			var imgX: number = (value % imgColCount) * sw;
      
			//ctx.drawImage(img, imgX,imgY,tileW,tileH, x,y,tileW,tileH);
			img.drawScaled2(ctx, imgX, imgY, tileW, tileH, x, y, tileW, tileH);

		}
   
		setScale(scale: number) {
			this.tileWidth *= scale;
			this.tileHeight *= scale;
			this.screenRows = Math.ceil(this.screenHeight / this.tileHeight);
			this.screenCols = Math.ceil(this.screenWidth / this.tileWidth);
			var tilesetCount: number = this.tilesets.length;
			for (let i: number = 0; i < tilesetCount; i++) {
				return this.tilesets[i].setScale(scale);
			}
		}
   
		/**
		 * Returns the pixel width of this map.
		 * 
		 * @return {int} The pixel width of this map.
		 * @method
		 */
		getPixelWidth(): number {
			return this.colCount * this.tileWidth;
		}
   
		/**
		 * Returns the pixel height of this map.
		 * 
		 * @return {int} The pixel height of this map.
		 * @method
		 */
		getPixelHeight(): number {
			return this.rowCount * this.tileHeight;
		}
   
		/**
		 * Removes a layer from this map.
		 * @param {string} layerName The name of the layer to remove.
		 * @return {boolean} Whether a layer by that name was found.
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
}