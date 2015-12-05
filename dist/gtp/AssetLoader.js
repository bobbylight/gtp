var gtp;
(function (gtp) {
    'use strict';
    var AssetLoader = (function () {
        /**
         * Provides methods to load images, sounds, and Tiled maps.
         *
         * @param scale How much to scale image resources.
         * @param audio A web audio context.
         * @constructor
         */
        function AssetLoader(scale, audio, assetRoot) {
            if (scale === void 0) { scale = 1; }
            this._scale = scale || 1;
            this.loadingAssetData = {};
            this.responses = {};
            this.callback = null;
            this.audio = audio;
            this._assetRoot = assetRoot;
        }
        /**
         * Starts loading a JSON resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param url {string} The URL of the resource.
         */
        AssetLoader.prototype.addJson = function (id, url) {
            if (url === void 0) { url = id; }
            if (this._assetRoot) {
                url = this._assetRoot + url;
            }
            if (this._isAlreadyTracked(id)) {
                return;
            }
            this.loadingAssetData[id] = { type: gtp.AssetType.JSON };
            console.log('Adding: ' + id + ' => ' + url +
                ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            var that = this;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var response = xhr.responseText;
                    that._completed(id, response);
                }
            };
            xhr.open('GET', url, true);
            xhr.send(null);
        };
        /**
         * Starts loading a canvas resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param imageSrc {string} The URL of the resource.
         */
        AssetLoader.prototype.addCanvas = function (id, imageSrc) {
            if (this._assetRoot) {
                imageSrc = this._assetRoot + imageSrc;
            }
            var self = this;
            var image = document.createElement('img'); //new Image();
            if (this._isAlreadyTracked(id)) {
                return;
            }
            this.loadingAssetData[id] = { type: gtp.AssetType.IMAGE };
            console.log('Adding: ' + id + ' => ' + imageSrc +
                ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            image.addEventListener('load', function () {
                var canvas = gtp.ImageUtils.resize(image, self._scale);
                self._completed(id, canvas);
            });
            image.src = imageSrc;
        };
        /**
         * Starts loading an image resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param imageSrc {string} The URL of the resource.
         */
        AssetLoader.prototype.addImage = function (id, imageSrc) {
            if (this._assetRoot) {
                imageSrc = this._assetRoot + imageSrc;
            }
            var self = this;
            var image = document.createElement('img'); //new Image();
            if (this._isAlreadyTracked(id)) {
                return;
            }
            this.loadingAssetData[id] = { type: gtp.AssetType.IMAGE };
            console.log('Adding: ' + id + ' => ' + imageSrc +
                ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            image.addEventListener('load', function () {
                var canvas = gtp.ImageUtils.resize(image, self._scale);
                var gtpImage = new gtp.Image(canvas);
                self._completed(id, gtpImage);
            });
            image.src = imageSrc;
        };
        /**
         * Starts loading a sound resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param soundSrc {string} The URL of the resource.
         * @param {number} [loopStart=0] Where to start, in seconds, if/when this
         *        sound loops (which is typical when using a sound as music).
         * @param {boolean} [loopByDefaultIfMusic=true] Whether this sound should
         *        loop by default when it is played as music.
         */
        AssetLoader.prototype.addSound = function (id, soundSrc, loopStart, loopByDefaultIfMusic) {
            if (loopStart === void 0) { loopStart = 0; }
            if (loopByDefaultIfMusic === void 0) { loopByDefaultIfMusic = true; }
            if (this.audio.isInitialized()) {
                if (this._isAlreadyTracked(id)) {
                    return;
                }
                this.loadingAssetData[id] = { type: gtp.AssetType.AUDIO };
                if (this._assetRoot) {
                    soundSrc = this._assetRoot + soundSrc;
                }
                var self = this;
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    // TODO: Clean up this API
                    self.audio.context.decodeAudioData(xhr.response, function (buffer) {
                        var sound = new gtp.Sound(id, buffer, loopStart || 0);
                        if (typeof loopByDefaultIfMusic !== 'undefined') {
                            sound.setLoopsByDefaultIfMusic(loopByDefaultIfMusic);
                        }
                        self.audio.addSound(sound);
                        self._completed(id, buffer);
                    });
                };
                xhr.open('GET', soundSrc, true);
                xhr.responseType = 'arraybuffer';
                xhr.send(null);
            }
        };
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
        AssetLoader.prototype.addSpriteSheet = function (id, imageSrc, cellW, cellH, spacingX, spacingY, firstPixelTranslucent) {
            if (spacingX === void 0) { spacingX = 0; }
            if (spacingY === void 0) { spacingY = 0; }
            if (firstPixelTranslucent === void 0) { firstPixelTranslucent = false; }
            var self = this;
            spacingX = spacingX || 0;
            spacingY = spacingY || 0;
            cellW *= self._scale;
            cellH *= self._scale;
            spacingX *= self._scale;
            spacingY *= self._scale;
            if (this._assetRoot) {
                imageSrc = this._assetRoot + imageSrc;
            }
            var image = document.createElement('img'); //new Image();
            if (this._isAlreadyTracked(id)) {
                return;
            }
            this.loadingAssetData[id] = { type: gtp.AssetType.IMAGE };
            console.log('Adding: ' + id + ' => ' + imageSrc +
                ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            image.addEventListener('load', function () {
                var canvas = gtp.ImageUtils.resize(image, self._scale);
                var gtpImage = new gtp.Image(canvas);
                if (firstPixelTranslucent) {
                    gtpImage.makeColorTranslucent(0, 0);
                }
                var ss = new gtp.SpriteSheet(gtpImage, cellW, cellH, spacingX, spacingY);
                self._completed(id, ss);
            });
            image.src = imageSrc;
        };
        /**
         * Registers all images needed by the TMX map's tilesets to this asset
         * loader.
         *
         * @param {tiled.TiledMap} map The Tiled map.
         */
        AssetLoader.prototype.addTmxMap = function (map) {
            if (map.tilesets && map.tilesets.length) {
                for (var i = 0; i < map.tilesets.length; i++) {
                    var tileset = map.tilesets[i];
                    var id = '_tilesetImage_' + tileset.name;
                    this.addImage(id, tileset.image);
                }
            }
        };
        /**
         * Returns the image corresponding to a Tiled tileset.  This method is
         * called by the library and is typically not called directly by the
         * application.
         *
         * @param {tiled.TiledTileset} tileset The tile set.
         * @return The canvas.
         */
        AssetLoader.prototype.getTmxTilesetImage = function (tileset) {
            return this.responses['_tilesetImage_' + tileset.name];
        };
        /**
         * Retrieves a resource by ID.
         * @param res {string} The ID of the resource.
         * @return The resource, or null if not found.
         */
        AssetLoader.prototype.get = function (res) {
            return this.responses[res];
        };
        AssetLoader.prototype._isAlreadyTracked = function (id) {
            if (this.loadingAssetData[id]) {
                console.log('A resource with id ' + id + ' is already loading.  Assuming they are the same');
                return true;
            }
            else if (this.responses[id]) {
                console.log('A resource with id ' + id + ' has already been loaded.');
                return true;
            }
        };
        /**
         * Adds a resource.
         * @param res {string} The ID for the resource.
         * @param value {any} The resource value.
         */
        AssetLoader.prototype.set = function (res, value) {
            this.responses[res] = value;
        };
        AssetLoader.prototype._completed = function (res, response) {
            if (!this.loadingAssetData[res]) {
                console.error('Resource not found! - ' + res);
                return;
            }
            if (this.loadingAssetData[res].type === gtp.AssetType.JSON) {
                response = JSON.parse(response);
            }
            this.responses[res] = response;
            delete this.loadingAssetData[res];
            console.log('Completed: ' + res + ', remaining == ' + gtp.Utils.getObjectSize(this.loadingAssetData) + ', callback == ' + (this.callback !== null));
            if (this.isDoneLoading() && this.callback) {
                this.callback.call();
                delete this.callback;
                console.log('... Callback called and deleted (callback == ' + (this.callback !== null) + ')');
                if (this.nextCallback) {
                    this.callback = this.nextCallback;
                    delete this.nextCallback; //this.nextCallback = null;
                }
            }
            else {
                console.log('... Not running callback - ' + this.isDoneLoading() + ', ' + (this.callback !== null));
            }
        };
        /**
         * Returns whether all assets in thie loader have successfully loaded.
         *
         * @return {boolean} Whether all assets have loaded.
         */
        AssetLoader.prototype.isDoneLoading = function () {
            return gtp.Utils.getObjectSize(this.loadingAssetData) === 0;
        };
        AssetLoader.prototype.onLoad = function (callback) {
            if (this.isDoneLoading()) {
                callback();
            }
            else if (this.callback) {
                this.nextCallback = callback;
            }
            else {
                this.callback = callback;
            }
        };
        return AssetLoader;
    })();
    gtp.AssetLoader = AssetLoader;
})(gtp || (gtp = {}));

//# sourceMappingURL=AssetLoader.js.map
