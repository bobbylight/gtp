declare module gtp {
    class AssetLoader {
        private _scale;
        private loadingAssetData;
        private responses;
        private callback;
        audio: gtp.AudioSystem;
        private _assetRoot;
        private nextCallback;
        /**
         * Provides methods to load images, sounds, and Tiled maps.
         *
         * @param scale How much to scale image resources.
         * @param audio A web audio context.
         * @constructor
         */
        constructor(scale: number, audio: gtp.AudioSystem, assetRoot?: string);
        /**
         * Starts loading a JSON resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param url {string} The URL of the resource.
         */
        addJson(id: string, url?: string): void;
        /**
         * Starts loading a canvas resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param imageSrc {string} The URL of the resource.
         */
        addCanvas(id: string, imageSrc: string): void;
        /**
         * Starts loading an image resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param imageSrc {string} The URL of the resource.
         */
        addImage(id: string, imageSrc: string): void;
        /**
         * Starts loading a sound resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param soundSrc {string} The URL of the resource.
         * @param {number} [loopStart=0] Where to start, in seconds, if/when this
         *        sound loops (which is typical when using a sound as music).
         * @param {boolean} [loopByDefaultIfMusic=true] Whether this sound should
         *        loop by default when it is played as music.
         */
        addSound(id: string, soundSrc: string, loopStart?: number, loopByDefaultIfMusic?: boolean): void;
        /**
         * Starts loading a sprite sheet resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param imageSrc {string} The URL of the resource.
         * @param {int} cellW The width of a cell.
         * @param {int} cellH The height of a cell.
         * @param {int} spacingX The horizontal spacing between cells.  Assumed to
         *        be 0 if not defined.
         * @param {int} spacingY The vertical spacing between cells.  Assumed to
         *        be 0 if not defined.
         * @param {boolean} firstPixelTranslucent If truthy, the pixel at (0, 0)
         *        is made translucent, along with all other pixels of the same color.
         */
        addSpriteSheet(id: string, imageSrc: string, cellW: number, cellH: number, spacingX?: number, spacingY?: number, firstPixelTranslucent?: boolean): void;
        /**
         * Registers all images needed by the TMX map's tilesets to this asset
         * loader.
         *
         * @param {tiled.TiledMap} map The Tiled map.
         */
        addTmxMap(map: tiled.TiledMap): void;
        /**
         * Returns the image corresponding to a Tiled tileset.  This method is
         * called by the library and is typically not called directly by the
         * application.
         *
         * @param {tiled.TiledTileset} tileset The tile set.
         * @return The canvas.
         */
        getTmxTilesetImage(tileset: tiled.TiledTileset): gtp.Image;
        /**
         * Retrieves a resource by ID.
         * @param res {string} The ID of the resource.
         * @return The resource, or null if not found.
         */
        get(res: string): any;
        _isAlreadyTracked(id: string): boolean;
        /**
         * Adds a resource.
         * @param res {string} The ID for the resource.
         * @param value {any} The resource value.
         */
        set(res: string, value: any): void;
        _completed(res: string, response: any): void;
        /**
         * Returns whether all assets in thie loader have successfully loaded.
         *
         * @return {boolean} Whether all assets have loaded.
         */
        isDoneLoading(): boolean;
        onLoad(callback: Function): void;
    }
}
