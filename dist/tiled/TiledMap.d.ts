declare module tiled {
    class TiledMap {
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
        layersByName: {
            [name: string]: TiledLayer;
        };
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
        constructor(data: any, args: any);
        /**
         * Adds a layer to this map.  This method is called internally by the library
         * and the programmer typically does not need to call it.
         *
         * @param {object} layerData The raw layer data.
         * @method
         */
        addLayer(layerData: any): void;
        draw(ctx: CanvasRenderingContext2D, centerRow: number, centerCol: number, dx?: number, dy?: number): void;
        /**
         * Returns a layer by name.
         *
         * @param {string} name The name of the layer.
         * @return {tiled.TiledLayer} The layer, or null if there is no layer with
         *         that name.
         * @method
         */
        getLayer(name: string): TiledLayer;
        /**
         * Returns a layer by index.
         *
         * @param {int} index The index of the layer.
         * @return {tiled.TiledLayer} The layer, or null if there is no layer at
         *         that index.
         * @method
         */
        getLayerByIndex(index: number): TiledLayer;
        /**
         * Returns the number of layers in this map.
         *
         * @return {int} The number of layers in this map.
         */
        getLayerCount(): number;
        private _getImageForGid(gid);
        drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, value: number, layer: TiledLayer): void;
        setScale(scale: number): void;
        /**
         * Returns the pixel width of this map.
         *
         * @return {int} The pixel width of this map.
         * @method
         */
        getPixelWidth(): number;
        /**
         * Returns the pixel height of this map.
         *
         * @return {int} The pixel height of this map.
         * @method
         */
        getPixelHeight(): number;
        /**
         * Removes a layer from this map.
         * @param {string} layerName The name of the layer to remove.
         * @return {boolean} Whether a layer by that name was found.
         * @method
         */
        removeLayer(layerName: string): boolean;
    }
}
