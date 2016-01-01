declare module gtp {
    /**
     * Loads resources for a game.  All games have to load resources such as
     * images, sound effects, JSON data, sprite sheets, etc.  This class provides
     * a wrapper around the loading of such resources, as well as a callback
     * mechanism to know when loading completes.  Games can use this class in a
     * "loading" state, for example.<p>
     *
     * Currently supported resources include:
     * <ul>
     *   <li>Images
     *   <li>Sound effects
     *   <li>JSON data
     *   <li>Sprite sheets
     *   <li>TMX maps
     * </ul>
     */
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
         * @param {number} scale How much to scale image resources.
         * @param {gtp.AudioSystem} audio A web audio context.
         * @param {string} [assetRoot] If specified, this is the implicit root
         *        directory for all assets to load.  Use this if all assets are
         *        in a subfolder or different hierarchy than the project itself.
         * @constructor
         */
        constructor(scale: number, audio: gtp.AudioSystem, assetRoot?: string);
        /**
         * Starts loading a JSON resource.
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} [url=id] The URL of the resource, defaulting to
         *        {@code id} if not specified.
         */
        addJson(id: string, url?: string): void;
        /**
         * Starts loading a canvas resource.
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} imageSrc The URL of the resource.
         */
        addCanvas(id: string, imageSrc: string): void;
        /**
         * Starts loading an image resource.
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} imageSrc The URL of the resource.
         * @param {boolean} firstPixelTranslucent If truthy, the pixel at (0, 0)
         *        is made translucent, along with all other pixels of the same
         *        color.  The default value is <code>false</code>.
         */
        addImage(id: string, imageSrc: string, firstPixelTranslucent?: boolean): void;
        /**
         * Starts loading a sound resource.
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} soundSrc The URL of the resource.
         * @param {number} [loopStart=0] Where to start, in seconds, if/when this
         *        sound loops (which is typical when using a sound as music).
         * @param {boolean} [loopByDefaultIfMusic=true] Whether this sound should
         *        loop by default when it is played as music.
         */
        addSound(id: string, soundSrc: string, loopStart?: number, loopByDefaultIfMusic?: boolean): void;
        /**
         * Starts loading a sprite sheet resource.
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} imageSrc The URL of the resource.
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
         * @return {gtp.Image} The tileset image.
         */
        getTmxTilesetImage(tileset: tiled.TiledTileset): gtp.Image;
        /**
         * Retrieves a resource by ID.
         * @param {string} res The ID of the resource.
         * @return The resource, or null if not found.
         */
        get(res: string): any;
        _isAlreadyTracked(id: string): boolean;
        /**
         * Adds a resource.
         * @param {string} res The ID for the resource.
         * @param {any} value The resource value.
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
