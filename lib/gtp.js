var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("gtp/BrowserUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Utility methods for interfacing with browser APIs.  This stuff is
     * typically hard to unit test, and thus is in this class so it is easily
     * mockable.
     *
     * @constructor
     */
    var BrowserUtil = (function () {
        function BrowserUtil() {
        }
        /**
         * Returns <code>window.location.search</code>.
         */
        BrowserUtil.getWindowLocationSearch = function () {
            return window.location.search;
        };
        return BrowserUtil;
    }());
    exports.BrowserUtil = BrowserUtil;
});
define("gtp/Utils", ["require", "exports", "gtp/BrowserUtil"], function (require, exports, BrowserUtil_1) {
    "use strict";
    /**
     * Obligatory utility methods for games.
     * @constructor
     */
    var Utils = (function () {
        function Utils() {
        }
        /**
         * Returns the number of elements in an object.
         *
         * @param {object} obj The object.
         * @return {int} The number of elements in the object.
         */
        Utils.getObjectSize = function (obj) {
            var size = 0;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size;
        };
        /**
         * Returns the value of a request parameter.
         *
         * @param {string} param The name of the request parameter.
         * @return {string} The value of the request parameter, or <code>null</code>
         *         if it was not specified.
         */
        Utils.getRequestParam = function (param) {
            // Replace leading '?' with '&'
            var params = '&' + BrowserUtil_1.BrowserUtil.getWindowLocationSearch().substring(1);
            var searchFor = '&' + param;
            var index = params.indexOf(searchFor);
            if (index >= -1) {
                var start = index + searchFor.length;
                if (params.charAt(start) === '=') {
                    start++;
                    var end = params.indexOf('&', start); // &foo=val1&bar=val2
                    if (end === -1) {
                        end = params.length; // &foo=val1
                    }
                    return params.substring(start, end);
                }
                else if (params.charAt(start) === '&') {
                    return ''; // &foo&bar
                }
                else if (start === params.length) {
                    return ''; // &foo
                }
            }
            return null;
        };
        /**
         * Equivalent to dojo/_base/hitch, returns a function in a specific scope.
         *
         * @param {object} scope The scope to run the function in (e.g. the value of
         *        "this").
         * @param {function} func The function.
         * @return {function} A function that does the same thing as 'func', but in the
         *         specified scope.
         */
        Utils.hitch = function (scope, func) {
            // "arguments" cannot be referenced in arrow functions
            return function () {
                func.apply(scope, arguments);
            };
        };
        /**
         * Adds the properties of one element into another.
         *
         * @param {object} source The object with properties to mix into another object.
         * @param {object} target The object that will receive the new properties.
         */
        Utils.mixin = function (source, target) {
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    //if (!target[prop]) {
                    target[prop] = source[prop];
                }
            }
        };
        Utils.randomInt = function (min, max) {
            var realMin, realMax;
            if (typeof max === 'undefined') {
                realMin = 0;
                realMax = min;
            }
            else {
                realMin = min;
                realMax = max;
            }
            // Using Math.round() will give you a non-uniform distribution!
            return Math.floor(Math.random() * (realMax - realMin)) + realMin;
        };
        /**
         * Returns a time in milliseconds.  This will be high resolution, if
         * possible.  This method should be used to implement constructs like
         * delays.
         * @return {number} A time, in milliseconds.
         */
        Utils.timestamp = function () {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            }
            return Date.now(); // IE < 10, PhantomJS 1.x, which is used by unit tests
        };
        /**
         * Defines console functions for IE9 and other braindead browsers.
         */
        Utils.initConsole = function () {
            'use strict';
            if (!window.console) {
                var noOp = function () { };
                window.console = {
                    info: noOp,
                    log: noOp,
                    warn: noOp,
                    'error': noOp
                };
            }
        };
        return Utils;
    }());
    exports.Utils = Utils;
});
define("gtp/_GameTimer", ["require", "exports", "gtp/Utils"], function (require, exports, Utils_1) {
    "use strict";
    /**
     * This class keeps track of game time.  That includes both total running
     * time, and "active time" (time not spent on paused screens, etc.).
     * @constructor
     */
    var _GameTimer = (function () {
        function _GameTimer() {
            this._paused = false;
            this._pauseStart = 0;
            this._updating = true;
            this._notUpdatingStart = 0;
        }
        Object.defineProperty(_GameTimer.prototype, "paused", {
            /**
             * Returns whether this game is paused.
             * @return {boolean} Whether this game is paused.
             */
            get: function () {
                return this._paused;
            },
            /**
             * Sets whether the game is paused.  The game is still told to handle
             * input, update itself and render.  This is simply a flag that should
             * be set whenever a "pause" screen is displayed.  It stops the "in-game
             * timer" until the game is unpaused.
             *
             * @param paused Whether the game should be paused.
             * @see setUpdating
             */
            set: function (paused) {
                // Cannot pause while !updating, so this is okay
                if (this._paused !== paused) {
                    this._paused = paused;
                    if (paused) {
                        this._pauseStart = Utils_1.Utils.timestamp();
                    }
                    else {
                        var pauseTime = Utils_1.Utils.timestamp() - this._pauseStart;
                        this._startShift += pauseTime;
                        this._pauseStart = 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_GameTimer.prototype, "playTime", {
            /**
             * Returns the length of time the game has been played so far.  This is
             * "playable time;" that is, time in which the user is playing, and the
             * game is not paused or in a "not updating" state (such as the main
             * frame not having focus).
             *
             * @return {number} The amount of time the game has been played, in
             *         milliseconds.
             * @see resetPlayTime
             */
            get: function () {
                if (this._pauseStart !== 0) {
                    return this._pauseStart - this._startShift;
                }
                else if (this._notUpdatingStart !== 0) {
                    return this._notUpdatingStart - this._startShift;
                }
                return Utils_1.Utils.timestamp() - this._startShift;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_GameTimer.prototype, "updating", {
            /**
             * Returns whether this game is updating itself each frame.
             *
             * @return {boolean} Whether this game is updating itself.
             */
            get: function () {
                return this._updating;
            },
            /**
             * Sets whether the game should be "updating" itself.  If a game is not
             * "updating" itself, then it is effectively "paused," and will not accept
             * any input from the user.<p>
             *
             * This method can be used to temporarily "pause" a game when the game
             * window loses focus, for example.
             *
             * @param updating {boolean} Whether the game should be updating itself.
             */
            set: function (updating) {
                if (this._updating !== updating) {
                    this._updating = updating;
                    if (!this.paused) {
                        if (!this._updating) {
                            this._notUpdatingStart = Utils_1.Utils.timestamp();
                        }
                        else {
                            var notUpdatingTime = Utils_1.Utils.timestamp() - this._notUpdatingStart;
                            this._startShift += notUpdatingTime;
                            this._notUpdatingStart = 0;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Resets the "playtime in milliseconds" timer back to <code>0</code>.
         *
         * @see playTime
         */
        _GameTimer.prototype.resetPlayTime = function () {
            if (this.paused || !this.updating) {
                throw 'Cannot reset playtime millis when paused or not updating';
            }
            this._startShift = Utils_1.Utils.timestamp();
        };
        /**
         * Resets this timer.  This should be called when a new game is started.
         */
        _GameTimer.prototype.start = function () {
            this._startShift = Utils_1.Utils.timestamp();
        };
        return _GameTimer;
    }());
    exports._GameTimer = _GameTimer;
});
define("gtp/ImageUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * General-purpose utilities for manipulating images in canvases.
     * @constructor
     */
    var ImageUtils = (function () {
        function ImageUtils() {
        }
        /**
         * Takes an img/canvas and a scaling factor and returns the scaled image.
         * @method
         */
        ImageUtils.resize = function (img, scale) {
            // The original image is drawn into an offscreen canvas of the same size
            // and copied, pixel by pixel into another offscreen canvas with the
            // new size.
            if (scale === void 0) { scale = 1; }
            var orig, origCtx;
            if (img instanceof HTMLImageElement) {
                orig = ImageUtils.createCanvas(img.width, img.height);
                origCtx = orig.getContext('2d');
                origCtx.drawImage(img, 0, 0);
            }
            else {
                orig = img;
                origCtx = orig.getContext('2d');
            }
            if (scale === 1) {
                return orig; // No reason to scale
            }
            var origPixels = origCtx.getImageData(0, 0, img.width, img.height);
            var widthScaled = img.width * scale;
            var heightScaled = img.height * scale;
            var scaled = ImageUtils.createCanvas(widthScaled, heightScaled);
            var scaledCtx = scaled.getContext('2d');
            var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);
            for (var y = 0; y < heightScaled; y++) {
                for (var x = 0; x < widthScaled; x++) {
                    var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
                    var indexScaled = (y * widthScaled + x) * 4;
                    scaledPixels.data[indexScaled] = origPixels.data[index];
                    scaledPixels.data[indexScaled + 1] = origPixels.data[index + 1];
                    scaledPixels.data[indexScaled + 2] = origPixels.data[index + 2];
                    scaledPixels.data[indexScaled + 3] = origPixels.data[index + 3];
                }
            }
            scaledCtx.putImageData(scaledPixels, 0, 0);
            return scaled;
        };
        ImageUtils.createCanvas = function (width, height, parentDiv) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            ImageUtils.prepCanvas(canvas);
            if (parentDiv) {
                var actualParent = void 0;
                if (typeof parentDiv === 'string') {
                    actualParent = document.getElementById(parentDiv);
                }
                else {
                    actualParent = parentDiv;
                }
                // Clear previous contents in place there was a placeholder image
                actualParent.innerHTML = '';
                actualParent.appendChild(canvas);
            }
            return canvas;
        };
        ImageUtils.prepCanvas = function (canvas) {
            // Use "any" instead of "CanvasRenderingContext2D" since  the TypeScript definition
            // files don't like the experimental *imageSmoothingEnabled properties
            var ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.oImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            /* TODO: set imageRendering CSS properties based on some Game config property */
        };
        /**
         * Converts a color of a particular type to completely transparent in a canvas.
         *
         * @param {Canvas} canvas The canvas to operate on.
         * @param {int} x The x-coordinate of the pixel whose color to change.  0 will
         *        be used if this parameter is undefined.
         * @param {int} y The y-coordinate of the pixel whose color to change.  0 will
         *        be used if this parameter is undefined.
         * @return {Canvas} The original canvas, which has been modified.
         * @method
         */
        ImageUtils.makeColorTranslucent = function (canvas, x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var ctx = canvas.getContext('2d');
            var w = canvas.width;
            var h = canvas.height;
            var pixels = ctx.getImageData(0, 0, w, h);
            var color = [];
            var offs = (y * w + x) * 4;
            for (var i = 0; i < 4; i++) {
                color[i] = pixels.data[offs + i];
            }
            for (y = 0; y < h; y++) {
                for (x = 0; x < w; x++) {
                    var index = (y * w + x) * 4;
                    if (pixels.data[index] === color[0] && pixels.data[index + 1] === color[1] &&
                        pixels.data[index + 2] === color[2] && pixels.data[index + 3] === color[3]) {
                        pixels.data[index] = 0;
                        pixels.data[index + 1] = 0;
                        pixels.data[index + 2] = 0;
                        pixels.data[index + 3] = 0;
                    }
                }
            }
            ctx.putImageData(pixels, 0, 0);
            return canvas;
        };
        /**
         * If <code>true</code>, subpixel rendering is allowed; otherwise, x- and
         * y-coordinates are rounded to the nearest integer when rendering images.
         */
        ImageUtils.allowSubpixelImageRendering = false;
        return ImageUtils;
    }());
    exports.ImageUtils = ImageUtils;
});
define("gtp/Image", ["require", "exports", "gtp/ImageUtils"], function (require, exports, ImageUtils_1) {
    "use strict";
    var Image = (function () {
        /**
         * A wrapper around images.  Handles browser-specific quirks and other things
         * a game shouldn't have to know about.
         *
         * @constructor
         */
        function Image(canvas, x, y, w, h) {
            this._canvas = canvas;
            if (x != null && y != null && w != null && h != null) {
                this.x = x;
                this.y = y;
                this._width = w;
                this._height = h;
            }
            else {
                this.x = this.y = 0;
                this._width = this._canvas.width;
                this._height = this._canvas.height;
            }
            this._ensure256Square();
        }
        /**
         * Chrome has trouble copying from a canvas in RAM to a canvas in GPU memory
         * and vice versa, unless all canvases are >= 256x256.
         */
        Image.prototype._ensure256Square = function () {
            if (this._canvas.width < 256 || this._canvas.height < 256) {
                var w = Math.max(256, this._canvas.width);
                var h = Math.max(256, this._canvas.height);
                var canvas2 = ImageUtils_1.ImageUtils.createCanvas(w, h);
                var ctx2 = canvas2.getContext('2d');
                ctx2.drawImage(this._canvas, 0, 0);
                this._canvas = canvas2;
            }
        };
        /**
         * Draws this image.
         *
         * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         */
        Image.prototype.draw = function (ctx, x, y) {
            if (!ImageUtils_1.ImageUtils.allowSubpixelImageRendering) {
                x = Math.round(x);
                y = Math.round(y);
            }
            ctx.drawImage(this._canvas, this.x, this.y, this._width, this._height, x, y, this._width, this._height);
        };
        /**
         * Draws this image.
         *
         * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} w The width to (possibly) stretch the image to when
         *              drawing.
         * @param {int} h The height to (possibly) stretch the image to when
         *              drawing.
         */
        Image.prototype.drawScaled = function (ctx, x, y, w, h) {
            if (!ImageUtils_1.ImageUtils.allowSubpixelImageRendering) {
                x = Math.round(x);
                y = Math.round(y);
            }
            ctx.drawImage(this._canvas, this.x, this.y, this._width, this._height, x, y, w, h);
        };
        /**
         * Draws this image.
         *
         * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
         * @param {int} srcX The x-coordinate at which to draw.
         * @param {int} srcY The y-coordinate at which to draw.
         * @param {int} srcW The width of the (possibly) sub-image to draw.
         * @param {int} srcH The height of the (possibly) sub-image to draw.
         * @param {int} destX The x-coordinate at which to draw.
         * @param {int} destY The y-coordinate at which to draw.
         * @param {int} destW The width to (possibly) stretch the image to when
         *              drawing.
         * @param {int} destH The height to (possibly) stretch the image to when
         *              drawing.
         */
        Image.prototype.drawScaled2 = function (ctx, srcX, srcY, srcW, srcH, destX, destY, destW, destH) {
            if (!ImageUtils_1.ImageUtils.allowSubpixelImageRendering) {
                srcX = Math.round(srcX);
                srcY = Math.round(srcY);
                destX = Math.round(destX);
                destY = Math.round(destY);
            }
            srcX = this.x + srcX;
            srcY = this.y + srcY;
            ctx.drawImage(this._canvas, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
        };
        /**
         * Converts a color of a particular type to completely transparent in this
         * image.
         *
         * @param {int} x The x-coordinate of the pixel whose color to change.  0 will
         *        be used if this parameter is undefined.
         * @param {int} y The y-coordinate of the pixel whose color to change.  0 will
         *        be used if this parameter is undefined.
         * @return {Image} This image, which has been modified.
         * @method
         */
        Image.prototype.makeColorTranslucent = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            ImageUtils_1.ImageUtils.makeColorTranslucent(this._canvas, x, y);
        };
        Object.defineProperty(Image.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        return Image;
    }());
    exports.Image = Image;
});
define("gtp/SpriteSheet", ["require", "exports"], function (require, exports) {
    "use strict";
    var SpriteSheet = (function () {
        /**
         * Creates a sprite sheet.
         *
         * @param {Image} gtpImage A GTP image that is the source for the sprite sheet.
         * @param {int} cellW The width of a cell in the sprite sheet.
         * @param {int} cellH The height of a cell in the sprite sheet.
         * @param {int} [spacing=1] Optional empty space between cells.
         * @param {int} [spacingY=spacing] Optional vertical empty space between cells.
         *        Specify only if different than the horizontal spacing.
         * @constructor
         */
        function SpriteSheet(gtpImage, cellW, cellH, spacing, spacingY) {
            if (spacing === void 0) { spacing = 1; }
            if (spacingY === void 0) { spacingY = spacing; }
            this.gtpImage = gtpImage;
            this.cellW = cellW;
            this.cellH = cellH;
            this.spacingX = typeof spacing === 'undefined' ? 1 : spacing;
            this.spacingY = typeof spacingY === 'undefined' ? this.spacingX : spacingY;
            this.rowCount = Math.floor(gtpImage.height / (cellH + this.spacingY));
            if ((gtpImage.height - this.rowCount * (cellH + this.spacingY)) >= cellH) {
                this.rowCount++;
            }
            this.colCount = Math.floor(gtpImage.width / (cellW + this.spacingX));
            if ((gtpImage.width - this.colCount * (cellW + this.spacingX)) >= cellW) {
                this.colCount++;
            }
            this.size = this.rowCount * this.colCount;
        }
        /**
         * Draws a sprite in this sprite sheet by row and column.
         * @param {CanvasRenderingContext2D} ctx The canvas' context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} row The row in the sprite sheet of the sprite to draw.
         * @param {int} col The column in the sprite sheet of the sprite to draw.
         */
        SpriteSheet.prototype.drawSprite = function (ctx, x, y, row, col) {
            var cellW = this.cellW;
            var cellH = this.cellH;
            var srcX = (cellW + this.spacingX) * col; //(col-1);
            var srcY = (cellH + this.spacingY) * row; //(row-1);
            //ctx.drawImage(this.gtpImage.canvas, srcX,srcY,cellW,cellH, x,y,cellW,cellH);
            this.gtpImage.drawScaled2(ctx, srcX, srcY, cellW, cellH, x, y, cellW, cellH);
        };
        /**
         * Draws a sprite in this sprite sheet by index
         * (<code>row*colCount + col</code>).
         * @param {CanvasRenderingContext2D} ctx The canvas' context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} index The index in the sprite sheet of the sprite to draw.
         */
        SpriteSheet.prototype.drawByIndex = function (ctx, x, y, index) {
            var row = Math.floor(index / this.colCount);
            var col = Math.floor(index % this.colCount);
            this.drawSprite(ctx, x, y, row, col);
        };
        return SpriteSheet;
    }());
    exports.SpriteSheet = SpriteSheet;
});
define("gtp/AssetType", ["require", "exports"], function (require, exports) {
    "use strict";
    (function (AssetType) {
        AssetType[AssetType["UNKNOWN"] = 0] = "UNKNOWN";
        AssetType[AssetType["IMAGE"] = 1] = "IMAGE";
        AssetType[AssetType["AUDIO"] = 2] = "AUDIO";
        AssetType[AssetType["JSON"] = 3] = "JSON";
    })(exports.AssetType || (exports.AssetType = {}));
    var AssetType = exports.AssetType;
});
define("gtp/Sound", ["require", "exports"], function (require, exports) {
    "use strict";
    var Sound = (function () {
        function Sound(id, buffer, loopStart) {
            if (loopStart === void 0) { loopStart = 0; }
            this._id = id;
            this._buffer = buffer;
            this._loopsByDefault = true;
            this._loopStart = loopStart;
        }
        Sound.prototype.getBuffer = function () {
            return this._buffer;
        };
        Sound.prototype.getId = function () {
            return this._id;
        };
        Sound.prototype.getLoopsByDefaultIfMusic = function () {
            return this._loopsByDefault;
        };
        Sound.prototype.setLoopsByDefaultIfMusic = function (loopsByDefault) {
            this._loopsByDefault = loopsByDefault;
        };
        Sound.prototype.getLoopStart = function () {
            return this._loopStart;
        };
        Sound.prototype.setLoopStart = function (loopStart) {
            this._loopStart = loopStart;
        };
        return Sound;
    }());
    exports.Sound = Sound;
});
define("gtp/Keys", ["require", "exports"], function (require, exports) {
    "use strict";
    (function (Keys) {
        Keys[Keys["KEY_ENTER"] = 13] = "KEY_ENTER";
        Keys[Keys["KEY_SHIFT"] = 16] = "KEY_SHIFT";
        Keys[Keys["KEY_CTRL"] = 17] = "KEY_CTRL";
        Keys[Keys["KEY_SPACE"] = 32] = "KEY_SPACE";
        Keys[Keys["KEY_LEFT_ARROW"] = 37] = "KEY_LEFT_ARROW";
        Keys[Keys["KEY_UP_ARROW"] = 38] = "KEY_UP_ARROW";
        Keys[Keys["KEY_RIGHT_ARROW"] = 39] = "KEY_RIGHT_ARROW";
        Keys[Keys["KEY_DOWN_ARROW"] = 40] = "KEY_DOWN_ARROW";
        Keys[Keys["KEY_0"] = 48] = "KEY_0";
        Keys[Keys["KEY_1"] = 49] = "KEY_1";
        Keys[Keys["KEY_2"] = 50] = "KEY_2";
        Keys[Keys["KEY_3"] = 51] = "KEY_3";
        Keys[Keys["KEY_4"] = 52] = "KEY_4";
        Keys[Keys["KEY_5"] = 53] = "KEY_5";
        Keys[Keys["KEY_6"] = 54] = "KEY_6";
        Keys[Keys["KEY_7"] = 55] = "KEY_7";
        Keys[Keys["KEY_8"] = 56] = "KEY_8";
        Keys[Keys["KEY_9"] = 57] = "KEY_9";
        Keys[Keys["KEY_A"] = 65] = "KEY_A";
        Keys[Keys["KEY_B"] = 66] = "KEY_B";
        Keys[Keys["KEY_C"] = 67] = "KEY_C";
        Keys[Keys["KEY_D"] = 68] = "KEY_D";
        Keys[Keys["KEY_E"] = 69] = "KEY_E";
        Keys[Keys["KEY_F"] = 70] = "KEY_F";
        Keys[Keys["KEY_G"] = 71] = "KEY_G";
        Keys[Keys["KEY_H"] = 72] = "KEY_H";
        Keys[Keys["KEY_I"] = 73] = "KEY_I";
        Keys[Keys["KEY_J"] = 74] = "KEY_J";
        Keys[Keys["KEY_K"] = 75] = "KEY_K";
        Keys[Keys["KEY_L"] = 76] = "KEY_L";
        Keys[Keys["KEY_M"] = 77] = "KEY_M";
        Keys[Keys["KEY_N"] = 78] = "KEY_N";
        Keys[Keys["KEY_O"] = 79] = "KEY_O";
        Keys[Keys["KEY_P"] = 80] = "KEY_P";
        Keys[Keys["KEY_Q"] = 81] = "KEY_Q";
        Keys[Keys["KEY_R"] = 82] = "KEY_R";
        Keys[Keys["KEY_S"] = 83] = "KEY_S";
        Keys[Keys["KEY_T"] = 84] = "KEY_T";
        Keys[Keys["KEY_U"] = 85] = "KEY_U";
        Keys[Keys["KEY_V"] = 86] = "KEY_V";
        Keys[Keys["KEY_W"] = 87] = "KEY_W";
        Keys[Keys["KEY_X"] = 88] = "KEY_X";
        Keys[Keys["KEY_Y"] = 89] = "KEY_Y";
        Keys[Keys["KEY_Z"] = 90] = "KEY_Z";
    })(exports.Keys || (exports.Keys = {}));
    var Keys = exports.Keys;
});
define("gtp/InputManager", ["require", "exports", "gtp/Keys"], function (require, exports, Keys_1) {
    "use strict";
    var InputManager = (function () {
        /**
         * Handles input for games.<p>
         *
         * For keyboards, allows polling of individual key presses, both with and
         * without the keyboard repeat delay.<p>
         *
         * Touch and mouse input are currently not supported.
         *
         * @constructor
         * @param {int} [keyRefireMillis=0] What the key refiring time should be, in
         *        milliseconds.  A value of 0 means to take the operating system
         *        default.
         */
        function InputManager(keyRefireMillis) {
            this.keys = [];
            this._refireMillis = keyRefireMillis || 0;
            this._repeatTimers = [];
        }
        /**
         * Resets a specific key to its "not depressed" state.
         *
         * @param {int} key The key to reset.
         * @see clearKeyStates
         */
        InputManager.prototype.clearKeyState = function (key) {
            this.keys[key] = false;
            if (this._repeatTimers[key]) {
                clearInterval(this._repeatTimers[key]);
                this._repeatTimers[key] = null;
            }
        };
        /**
         * Resets all keys to be in their "not depressed" states.
         */
        InputManager.prototype.clearKeyStates = function () {
            for (var i = 0; i < this.keys.length; i++) {
                this.clearKeyState(i);
            }
        };
        /**
         * Returns whether ctrl is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.ctrl = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(Keys_1.Keys.KEY_CTRL, clear);
        };
        /**
         * Returns whether down is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.down = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(Keys_1.Keys.KEY_DOWN_ARROW, clear);
        };
        /**
         * Returns whether enter is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.enter = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(Keys_1.Keys.KEY_ENTER, clear);
        };
        /**
         * Installs this keyboard manager.  Should be called during game
         * initialization.
         */
        InputManager.prototype.install = function () {
            var _this = this;
            document.onkeydown = function (e) { _this._keyDown(e); };
            document.onkeyup = function (e) { _this._keyUp(e); };
        };
        /**
         * Returns whether a specific key is pressed.
         * @param keyCode {Keys} A key code.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.isKeyDown = function (keyCode, clear) {
            if (clear === void 0) { clear = false; }
            var down = this.keys[keyCode];
            if (down && clear) {
                this.keys[keyCode] = false;
            }
            return down;
        };
        InputManager.prototype._keyDown = function (e) {
            var _this = this;
            var keyCode = e.keyCode;
            if (keyCode === 32 || (keyCode >= 37 && keyCode <= 40)) {
                e.preventDefault();
            }
            if (this._refireMillis) {
                if (!this._repeatTimers[keyCode]) {
                    this.keys[keyCode] = true;
                    this._repeatTimers[keyCode] = setInterval(function () {
                        //console.log('--- ' + new Date() + ': Setting keydown to true for: ' + keyCode + ', previous === ' + self.keys[keyCode]);
                        _this.keys[keyCode] = true;
                    }, this._refireMillis);
                }
            }
            else {
                this.keys[keyCode] = true;
            }
            e.stopPropagation();
        };
        InputManager.prototype._keyUp = function (e) {
            var key = e.keyCode;
            if (this._refireMillis) {
                if (this._repeatTimers[key]) {
                    this.keys[key] = false;
                    clearInterval(this._repeatTimers[key]);
                    this._repeatTimers[key] = null;
                }
                else {
                    console.error('_keyUp: Timer does not exist for key: ' + key + '!');
                }
            }
            else {
                this.keys[key] = false;
            }
            e.stopPropagation();
        };
        /**
         * Returns whether left is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.left = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(Keys_1.Keys.KEY_LEFT_ARROW, clear);
        };
        /**
         * Returns whether right is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.right = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(Keys_1.Keys.KEY_RIGHT_ARROW, clear);
        };
        /**
         * Returns whether shift is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.shift = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(Keys_1.Keys.KEY_SHIFT, clear);
        };
        /**
         * Returns whether up is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        InputManager.prototype.up = function (clear) {
            if (clear === void 0) { clear = false; }
            return this.isKeyDown(Keys_1.Keys.KEY_UP_ARROW, clear);
        };
        return InputManager;
    }());
    exports.InputManager = InputManager;
});
define("gtp/State", ["require", "exports", "gtp/Game"], function (require, exports, Game_1) {
    "use strict";
    /**
     * A base class for game states.  Basically just an interface with callbacks
     * for updating and rendering, along with other lifecycle-ish methods.
     * @class
     */
    var State = (function () {
        /**
         * A base class for game states.  Basically just an interface with callbacks
         * for updating and rendering, along with other lifecycle-ish methods.
         * @class
         * @constructor
         * @param args Arguments to the game state.
         */
        function State(args) {
            if (args && args instanceof Game_1.Game) {
                this.game = args;
            }
            else if (args) {
                this.game = args.game;
            }
            else {
                var gameWindow = window;
                this.game = gameWindow.game;
            }
        }
        /**
         * Called right before a state starts.  Subclasses can do any needed
         * initialization here.
         * @param {Game} game The game being played.
         * @see leaving
         */
        State.prototype.enter = function (game) {
            // Subclasses can override
        };
        /**
         * Called when this state is being left for another one.
         * @param {Game} game The game being played.
         * @see enter
         */
        State.prototype.leaving = function (game) {
        };
        /**
         * Subclasses should override this method to do necessary update logic.
         *
         * @param {number} delta The amount of time that has elapsed since the last
         *        frame/call to this method, as a floating point number.
         */
        State.prototype.update = function (delta) {
            // Subclasses should override
        };
        /**
         * Subclasses should override this method to render the screen.
         *
         * @param {CanvasRenderingContext2D} ctx The graphics context to render onto.
         */
        State.prototype.render = function (ctx) {
            // Subclasses should override
        };
        return State;
    }());
    exports.State = State;
});
define("gtp/Timer", ["require", "exports", "gtp/Utils"], function (require, exports, Utils_2) {
    "use strict";
    var Timer = (function () {
        /**
         * Allows you to time actions and log their runtimes to the console.
         * @constructor
         */
        function Timer() {
            this._startTimes = {};
            this._prefix = 'DEBUG';
        }
        /**
         * Sets the prefix to prepend to each line printed to the console.
         *
         * @param {String} prefix The new prefix.  'DEBUG' is used if not defined.
         */
        Timer.prototype.setLogPrefix = function (prefix) {
            if (prefix === void 0) { prefix = 'DEBUG'; }
            this._prefix = prefix;
        };
        /**
         * Starts timing something.
         *
         * @param {String} key A unique key for the thing being timed.
         */
        Timer.prototype.start = function (key) {
            this._startTimes[key] = Utils_2.Utils.timestamp();
        };
        /**
         * Stops timing something.
         *
         * @param {String} key The key of the thing being timed.
         */
        Timer.prototype.end = function (key) {
            var start = this._startTimes[key];
            if (!start) {
                console.error('Cannot end timer for "' + key + '" as it was never started');
                return -1;
            }
            var time = Utils_2.Utils.timestamp() - start;
            delete this._startTimes[key];
            return time;
        };
        /**
         * Stops timing something and logs its runtime to the console.
         *
         * @param {String} key The key of the thing being timed.
         */
        Timer.prototype.endAndLog = function (key) {
            var time = this.end(key);
            if (time > -1) {
                console.log(this._prefix + ': ' + key + ': ' + time + ' ms');
            }
        };
        return Timer;
    }());
    exports.Timer = Timer;
});
define("gtp/Game", ["require", "exports", "gtp/Keys", "gtp/InputManager", "gtp/_GameTimer", "gtp/Timer", "gtp/ImageUtils", "gtp/Utils", "gtp/AudioSystem", "gtp/AssetLoader"], function (require, exports, Keys_2, InputManager_1, _GameTimer_1, Timer_1, ImageUtils_2, Utils_3, AudioSystem_1, AssetLoader_1) {
    "use strict";
    /**
     * A base class for a game.
     *
     * @constructor
     */
    var Game = (function () {
        function Game(args) {
            if (args === void 0) { args = {}; }
            Utils_3.Utils.initConsole();
            this._scale = args.scale || 1;
            this.canvas = ImageUtils_2.ImageUtils.createCanvas(args.width, args.height, args.parent);
            this.inputManager = new InputManager_1.InputManager(args.keyRefreshMillis || 0);
            this.inputManager.install();
            this._targetFps = args.targetFps || 30;
            this._interval = 1000 / this._targetFps;
            this.lastTime = 0;
            this.audio = new AudioSystem_1.AudioSystem();
            this.audio.init();
            var assetPrefix = args.assetRoot || null;
            this.assets = new AssetLoader_1.AssetLoader(this._scale, this.audio, assetPrefix);
            this.clearScreenColor = 'rgb(0,0,0)';
            this.fpsColor = 'rgb(255,255,255)';
            this.statusMessageRGB = '255,255,255';
            this._statusMessageColor = null;
            this.showFps = false;
            this.frames = 0;
            this._fpsMsg = this._targetFps + ' fps';
            this._statusMessage = null;
            this._statusMessageAlpha = 0;
            this._gameTimer = new _GameTimer_1._GameTimer();
            this.timer = new Timer_1.Timer();
        }
        /**
         * Clears the screen.
         * @param {string} clearScreenColor The color to clear the screen with.
         *        If unspecified, <code>this.clearScreenColor</code> is used.
         */
        Game.prototype.clearScreen = function (clearScreenColor) {
            if (clearScreenColor === void 0) { clearScreenColor = this.clearScreenColor; }
            var ctx = this.canvas.getContext('2d');
            ctx.fillStyle = clearScreenColor;
            ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
        };
        Game.prototype.getHeight = function () {
            return this.canvas.height;
        };
        Game.prototype.getWidth = function () {
            return this.canvas.width;
        };
        Object.defineProperty(Game.prototype, "paused", {
            /**
             * Returns whether this game is paused.
             * @return {boolean} Whether this game is paused.
             */
            get: function () {
                return this._gameTimer.paused;
            },
            /**
             * Sets whether the game is paused.  The game is still told to handle
             * input, update itself and render.  This is simply a flag that should
             * be set whenever a "pause" screen is displayed.  It stops the "in-game
             * timer" until the game is unpaused.
             *
             * @param paused Whether the game should be paused.
             */
            set: function (paused) {
                if (paused) {
                    this.audio.pauseAll();
                }
                else {
                    this.audio.resumeAll();
                }
                this._gameTimer.paused = paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "playTime", {
            /**
             * Returns the length of time the game has been played so far.  This is
             * "playable time;" that is, time in which the user is playing, and the
             * game is not paused or in a "not updating" state (such as the main
             * frame not having focus).
             *
             * @return The amount of time the game has been played, in milliseconds.
             * @see resetPlayTime
             */
            get: function () {
                return this._gameTimer.playTime;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns a random number between <code>0</code> and
         * <code>number</code>, exclusive.
         *
         * @param max {number} The upper bound, exclusive.
         * @return {number} The random number.
         */
        Game.prototype.randomInt = function (max) {
            var min = 0;
            // Using Math.round() would give a non-uniform distribution!
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        Game.prototype.render = function () {
            var ctx = this.canvas.getContext('2d');
            this.state.render(ctx);
            if (this.showFps) {
                this._renderFps(ctx);
            }
            if (this._statusMessage && this._statusMessageAlpha > 0) {
                this._renderStatusMessage(ctx);
            }
        };
        Game.prototype._renderFps = function (ctx) {
            this.frames++;
            var now = Utils_3.Utils.timestamp();
            if (this.lastTime === null) {
                this.lastTime = now;
            }
            else if (now - this.lastTime >= 1000) {
                this._fpsMsg = this.frames + ' fps';
                this.frames = 0;
                this.lastTime = now;
            }
            var x = 10;
            var y = 15;
            ctx.font = '10pt Arial';
            ctx.fillStyle = this.fpsColor;
            ctx.fillText(this._fpsMsg, x, y);
        };
        Game.prototype._renderStatusMessage = function (ctx) {
            if (this._statusMessage) {
                var x = 10;
                var y = this.canvas.height - 6;
                ctx.font = '10pt Arial';
                ctx.fillStyle = this._statusMessageColor || '#fff';
                ctx.fillText(this._statusMessage, x, y);
            }
        };
        /**
         * Resets the "playtime in milliseconds" timer back to <code>0</code>.
         *
         * @see playTimeMillis
         */
        Game.prototype.resetPlayTime = function () {
            this._gameTimer.resetPlayTime();
        };
        Game.prototype.setState = function (state) {
            if (this.state) {
                this.state.leaving(this);
            }
            this.state = state;
            this.state.enter(this);
        };
        Game.prototype.setStatusMessage = function (message) {
            this._statusMessage = message;
            this._statusMessageAlpha = 2.0; // 1.0 of message, 1.0 of fading out
            this._statusMessageTime = Utils_3.Utils.timestamp() + 100;
        };
        /**
         * Starts the game loop.
         */
        Game.prototype.start = function () {
            var callback = Utils_3.Utils.hitch(this, this._tick);
            this._gameTimer.start();
            setInterval(callback, this._interval);
        };
        Game.prototype._tick = function () {
            if (this._statusMessage) {
                var time = Utils_3.Utils.timestamp();
                if (time > this._statusMessageTime) {
                    this._statusMessageTime = time + 100;
                    this._statusMessageAlpha -= 0.1;
                    var alpha = Math.min(1, this._statusMessageAlpha);
                    this._statusMessageColor = 'rgba(' + this.statusMessageRGB + ',' + alpha + ')';
                    if (this._statusMessageAlpha <= 0) {
                        this._statusMessage = null;
                    }
                }
            }
            this.update();
            this.render();
        };
        Game.prototype.toggleMuted = function () {
            var muted = this.audio.toggleMuted();
            this.setStatusMessage(muted ? 'Audio muted' : 'Audio enabled');
            return muted;
        };
        Game.prototype.toggleShowFps = function () {
            this.showFps = !this.showFps;
            this.setStatusMessage('FPS display: ' + (this.showFps ? 'on' : 'off'));
        };
        /**
         * Called during each tick to update game logic.  The default implementation
         * checks for a shortcut key to toggle the FPS display before delegating to
         * the current game state.  Subclasses can override, but typically update
         * logic is handled by game states.
         */
        Game.prototype.update = function () {
            var im = this.inputManager;
            if (im.isKeyDown(Keys_2.Keys.KEY_SHIFT)) {
                if (im.isKeyDown(Keys_2.Keys.KEY_F, true)) {
                    this.toggleShowFps();
                }
            }
            this.state.update(this._interval);
        };
        return Game;
    }());
    exports.Game = Game;
});
define("gtp/GtpBase", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("gtp/AudioSystem", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A sound effect that is currently being played.
     */
    var PlayingSound = (function () {
        function PlayingSound(config) {
            this._config = config;
            this._paused = false;
        }
        PlayingSound.prototype._initFromConfig = function () {
            var _this = this;
            this.id = this._config.id;
            this.soundId = this._config.soundId;
            this.source = this._config.audioSystem.context.createBufferSource();
            this.source.loop = this._config.loop;
            this.source.buffer = this._config.buffer;
            if (this._config.connectTo instanceof AudioNode) {
                this.source.connect(this._config.connectTo);
            }
            else {
                var nodes = this._config.connectTo;
                nodes.forEach(function (node) {
                    _this.source.connect(node);
                });
            }
            this._startOffset = this._config.startOffset || 0;
            if (!this._config.loop) {
                this.source.onended = this._config.onendedGenerator(this.id);
            }
        };
        PlayingSound.prototype.pause = function () {
            if (!this._paused) {
                this.source.stop();
                this._playedTime += this.source.context.currentTime - this._start;
                this._paused = true;
                this._start = 0;
            }
        };
        PlayingSound.prototype.resume = function () {
            if (this._paused) {
                this._paused = false;
                var prevStartOffset = this._startOffset;
                this._initFromConfig();
                this._startOffset = prevStartOffset + this._playedTime;
                this._startOffset = this._startOffset % this.source.buffer.duration;
                var curAudioTime = this.source.context.currentTime;
                this.source.start(curAudioTime, this._startOffset);
                this._start = curAudioTime;
                this._playedTime = 0;
            }
        };
        PlayingSound.prototype.start = function () {
            this._paused = false;
            this._initFromConfig();
            var curAudioTime = this.source.context.currentTime;
            this.source.start(curAudioTime, this._startOffset);
            this._start = curAudioTime;
            this._playedTime = 0;
        };
        return PlayingSound;
    }());
    var AudioSystem = (function () {
        /**
         * A wrapper around web audio for games.
         *
         * @constructor
         */
        function AudioSystem() {
            this._currentMusic = null;
            this._sounds = {};
            this._musicFade = 0.3; // seconds
            this._fadeMusic = true;
            this._muted = false;
            this._playingSounds = [];
            this._soundEffectIdGenerator = 0;
        }
        AudioSystem.prototype._createPlayingSound = function (id, loop, startOffset, doneCallback) {
            var _this = this;
            if (loop === void 0) { loop = false; }
            if (startOffset === void 0) { startOffset = 0; }
            var soundEffectId = this._createSoundEffectId();
            var soundEffect = new PlayingSound({
                audioSystem: this,
                buffer: this._sounds[id].getBuffer(),
                connectTo: this._volumeFaderGain,
                id: soundEffectId,
                loop: loop,
                onendedGenerator: function (playingSoundId) {
                    return function () {
                        _this._removePlayingSound(playingSoundId);
                        if (doneCallback) {
                            doneCallback(soundEffectId, id);
                        }
                    };
                },
                soundId: id,
                startOffset: startOffset,
            });
            return soundEffect;
        };
        AudioSystem.prototype._createSoundEffectId = function () {
            return this._soundEffectIdGenerator++;
        };
        /**
         * Initializes the audio system.
         */
        AudioSystem.prototype.init = function () {
            // Effectively cast to our window extension for static typing
            var w = window;
            try {
                w.AudioContext = w.AudioContext || w.webkitAudioContext;
                this.context = new w.AudioContext();
                this._volumeFaderGain = this.context.createGain();
                this._volumeFaderGain.gain.setValueAtTime(1, this.context.currentTime);
                this._volumeFaderGain.gain.value = 1;
                this._volumeFaderGain.connect(this.context.destination);
                this._initialized = true;
            }
            catch (e) {
                console.error('The Web Audio API is not supported in this browser.');
                this._initialized = false;
            }
        };
        /**
         * Registers a sound for later playback.
         * @param sound {Sound} The sound.
         */
        AudioSystem.prototype.addSound = function (sound) {
            if (this.context) {
                this._sounds[sound.getId()] = sound;
            }
        };
        AudioSystem.prototype.fadeOutMusic = function (newMusicId) {
            if (this.context) {
                if (this._currentMusic) {
                    if (!this._muted) {
                        // We must "anchor" via setValueAtTime() before calling a *rampToValue() method (???)
                        this._musicFaderGain.gain.setValueAtTime(this._musicFaderGain.gain.value, this.context.currentTime);
                        this._musicFaderGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this._musicFade);
                    }
                    var that_1 = this;
                    setTimeout(function () {
                        that_1.playMusic(newMusicId);
                    }, this._musicFade * 1000);
                }
                else {
                    this.playMusic(newMusicId);
                }
            }
        };
        /**
         * Returns the ID of the current music being played.
         *
         * @return {string} The current music's ID.
         * @see playMusic
         * @see stopMusic
         */
        AudioSystem.prototype.getCurrentMusic = function () {
            return this.currentMusicId;
        };
        /**
         * Returns whether the audio system initialized properly.  This will return
         * false if the user's browser does not support the web audio API.
         * @return {boolean} Whether the sound system is initialized
         */
        AudioSystem.prototype.isInitialized = function () {
            return this._initialized;
        };
        /**
         * Pauses all music and sound effects.
         * @see resumeAll
         */
        AudioSystem.prototype.pauseAll = function () {
            this._playingSounds.forEach(function (sound) {
                sound.pause();
            });
        };
        /**
         * Plays a specific sound as background music.  Only one "music" can play
         * at a time, as opposed to "sounds," of which multiple can be playing at
         * one time.
         * @param {string} id The ID of the resource to play as music.  If this is
         *        <code>null</code>, the current music is stopped but no new music
         *        is started.
         * @param {boolean} loop Whether the music should loop.
         * @see stopMusic
         */
        AudioSystem.prototype.playMusic = function (id, loop) {
            if (this.context) {
                // Note: We destroy and recreate _musicFaderGain each time, because
                // it appears to occasionally start playing muted if we do not do
                // so, even when gain.value===1, on Chrome 38.
                if (this._currentMusic) {
                    this.stopMusic(false);
                }
                if (!id) {
                    return; // null id => don't play any music
                }
                var sound = this._sounds[id];
                if (typeof loop === 'undefined') {
                    loop = sound.getLoopsByDefaultIfMusic();
                }
                this._musicFaderGain = this.context.createGain();
                this._musicFaderGain.gain.setValueAtTime(1, this.context.currentTime);
                this._musicFaderGain.gain.value = 1;
                this._currentMusic = this.context.createBufferSource();
                this._currentMusic.loop = loop;
                this._musicLoopStart = sound.getLoopStart() || 0;
                this._currentMusic.loopStart = this._musicLoopStart;
                this._currentMusic.buffer = sound.getBuffer();
                this._currentMusic.loopEnd = this._currentMusic.buffer.duration;
                this._currentMusic.connect(this._musicFaderGain);
                this._musicFaderGain.connect(this._volumeFaderGain);
                this._currentMusic.start(0);
                this.currentMusicId = id;
                console.log('Just started new music with id: ' + id + ', loop: ' + loop);
            }
        };
        /**
         * Plays the sound with the given ID.
         * @param {string} id The ID of the resource to play.
         * @param {boolean} loop Whether the music should loop.  Defaults to
         *        <code>false</code>.
         * @param {Function} doneCallback An optional callback to call when the
         *        sound completes. This callback will receive the returned numeric
         *        ID as a parameter.  This parameter is ignored if <code>loop</code>
         *        is <code>true</code>.
         * @return {number} An ID for the playing sound.  This can be used to
         *         stop a looping sound via <code>stopSound(id)</code>.
         * @see stopSound
         */
        AudioSystem.prototype.playSound = function (id, loop, doneCallback) {
            if (loop === void 0) { loop = false; }
            if (this.context) {
                var playingSound = this._createPlayingSound(id, loop, 0, doneCallback);
                this._playingSounds.push(playingSound);
                playingSound.start();
                return playingSound.id;
            }
            return -1;
        };
        /**
         * Removes a sound from our list of currently-being-played sound effects.
         * @param {number} id The sound effect to stop playing.
         * @return The sound just removed, or <code>null</code> if there was no such sound.
         */
        AudioSystem.prototype._removePlayingSound = function (id) {
            for (var i = 0; i < this._playingSounds.length; i++) {
                if (this._playingSounds[i].id === id) {
                    var sound = this._playingSounds[i];
                    this._playingSounds.splice(i, 1);
                    return sound;
                }
            }
            return null;
        };
        /**
         * Resumes all music and sound effects.
         * @see pauseAll
         */
        AudioSystem.prototype.resumeAll = function () {
            for (var i = 0; i < this._playingSounds.length; i++) {
                var sound = this._playingSounds[i];
                if (sound._paused) {
                    sound.resume();
                }
            }
        };
        /**
         * Stops the currently playing music, if any.
         * @param {boolean} pause If <code>true</code>, the music is only paused;
         *        otherwise, native resources are freed and the music cannot be
         *        resumed.
         * @see playMusic
         */
        AudioSystem.prototype.stopMusic = function (pause) {
            if (pause === void 0) { pause = false; }
            if (this._currentMusic) {
                this._currentMusic.stop();
                if (!pause) {
                    this._currentMusic.disconnect();
                    this._musicFaderGain.disconnect();
                    delete this._currentMusic;
                    delete this._musicFaderGain;
                }
            }
        };
        /**
         * Stops a playing sound, by ID.
         * @param {number} id The sound effect to stop.
         * @return {boolean} Whether the sound effect was stopped.  This will be
         *         <code>false</code> if the sound effect specified is no longer
         *         playing.
         * @see playSound
         */
        AudioSystem.prototype.stopSound = function (id) {
            var sound = this._removePlayingSound(id);
            if (sound) {
                sound.source.stop();
                return true;
            }
            return false;
        };
        AudioSystem.prototype.toggleMuted = function () {
            this._muted = !this._muted;
            if (this.context) {
                var initialValue = this._muted ? 0 : 1;
                this._volumeFaderGain.gain.setValueAtTime(initialValue, this.context.currentTime);
                this._volumeFaderGain.gain.value = initialValue;
            }
            return this._muted;
        };
        Object.defineProperty(AudioSystem.prototype, "fadeMusic", {
            get: function () {
                'use strict';
                return this._fadeMusic;
            },
            set: function (fade) {
                this._fadeMusic = fade;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AudioSystem.prototype, "musicFadeSeconds", {
            get: function () {
                return this._musicFade;
            },
            set: function (seconds) {
                this._musicFade = seconds;
            },
            enumerable: true,
            configurable: true
        });
        return AudioSystem;
    }());
    exports.AudioSystem = AudioSystem;
});
define("tiled/TiledTileset", ["require", "exports"], function (require, exports) {
    "use strict";
    var TiledTileset = (function () {
        function TiledTileset(data, imagePathModifier) {
            this.firstgid = data.firstgid;
            this.image = data.image;
            if (imagePathModifier) {
                this.image = imagePathModifier(this.image);
            }
            this.imageWidth = data.imagewidth;
            this.imageHeight = data.imageheight;
            this.margin = data.margin;
            this.name = data.name;
            this.properties = data.properties; // TODO
            this.spacing = data.spacing;
            this.tileWidth = data.tilewidth;
            this.tileHeight = data.tileheight;
        }
        TiledTileset.prototype.setScale = function (scale) {
            this.imageWidth *= scale;
            this.imageHeight *= scale;
            this.tileWidth *= scale;
            this.tileHeight *= scale;
            this.margin *= scale;
            this.spacing *= scale;
        };
        return TiledTileset;
    }());
    exports.TiledTileset = TiledTileset;
});
define("tiled/TiledObject", ["require", "exports", "gtp/Utils"], function (require, exports, Utils_4) {
    "use strict";
    var TiledObject = (function () {
        function TiledObject(data) {
            Utils_4.Utils.mixin(data, this);
            this.properties = this.properties || {};
            this.gid = this.gid || -1;
            // TODO: Remove
            var gameWindow = window;
            var game = gameWindow.game;
            this.x *= game._scale;
            this.y *= game._scale;
            this.width *= game._scale;
            this.height *= game._scale;
        }
        TiledObject.prototype.intersects = function (ox, oy, ow, oh) {
            'use strict';
            //console.log(this.name + ": " + ox + ',' + oy + ',' + ow + ',' + oh +
            //      ' -> ' + this.x + ',' + this.y + ',' + this.width + ',' + this.height);
            var tw = this.width;
            var th = this.height;
            var rw = ow;
            var rh = oh;
            if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
                return false;
            }
            var tx = this.x;
            var ty = this.y;
            var rx = ox;
            var ry = oy;
            rw += rx;
            rh += ry;
            tw += tx;
            th += ty;
            //      overflow || intersect
            return ((rw < rx || rw > tx) &&
                (rh < ry || rh > ty) &&
                (tw < tx || tw > rx) &&
                (th < ty || th > ry));
        };
        return TiledObject;
    }());
    exports.TiledObject = TiledObject;
});
define("tiled/TiledLayer", ["require", "exports", "tiled/TiledObject"], function (require, exports, TiledObject_1) {
    "use strict";
    var TiledLayer = (function () {
        function TiledLayer(map, data) {
            this.map = map;
            this.name = data.name;
            this.width = data.width;
            this.height = data.height;
            this.data = data.data;
            this.opacity = data.opacity;
            this.visible = data.visible;
            this.type = data.type;
            this.x = data.x;
            this.y = data.y;
            this._setObjects(data.objects);
        }
        TiledLayer.prototype.getData = function (row, col) {
            if (!this.data) {
                return -1;
            }
            var index = this._getIndex(row, col);
            return this.data[index];
        };
        TiledLayer.prototype.setData = function (row, col, value) {
            if (!this.data) {
                return false;
            }
            var index = this._getIndex(row, col);
            this.data[index] = value;
            return true;
        };
        TiledLayer.prototype._getIndex = function (row, col) {
            return row * this.map.colCount + col;
        };
        TiledLayer.prototype.getObjectByName = function (name) {
            return this.objectsByName ? this.objectsByName[name] : null;
        };
        TiledLayer.prototype.getObjectIntersecting = function (x, y, w, h) {
            if (this.objects) {
                for (var i = 0; i < this.objects.length; i++) {
                    var obj = this.objects[i];
                    if (obj.intersects(x, y, w, h)) {
                        return obj;
                    }
                }
            }
            return null;
        };
        TiledLayer.prototype.isObjectGroup = function () {
            return this.type === 'objectgroup';
        };
        TiledLayer.prototype._setObjects = function (objects) {
            'use strict';
            if (objects) {
                this.objects = [];
                this.objectsByName = {};
                for (var i = 0; i < objects.length; i++) {
                    var obj = new TiledObject_1.TiledObject(objects[i]);
                    this.objects.push(obj);
                    this.objectsByName[objects[i].name] = obj;
                }
            }
        };
        return TiledLayer;
    }());
    exports.TiledLayer = TiledLayer;
});
define("tiled/TiledMap", ["require", "exports", "tiled/TiledTileset", "tiled/TiledLayer"], function (require, exports, TiledTileset_1, TiledLayer_1) {
    "use strict";
    var TiledMap = (function () {
        /**
         * A 2d game map, generated in Tiled.
         *
         * @constructor
         */
        function TiledMap(data, args) {
            this.rowCount = data.height;
            this.colCount = data.width;
            this.tileWidth = args.tileWidth;
            this.tileHeight = args.tileHeight;
            this.screenWidth = args.screenWidth;
            this.screenHeight = args.screenHeight;
            this.screenRows = Math.ceil(this.screenHeight / this.tileHeight);
            this.screenCols = Math.ceil(this.screenWidth / this.tileWidth);
            var imagePathModifier = args ? args.imagePathModifier : null;
            this.layers = [];
            this.layersByName = {};
            this.objectGroups = [];
            for (var i = 0; i < data.layers.length; i++) {
                this.addLayer(data.layers[i]);
            }
            this.tilesets = [];
            if (data.tilesets && data.tilesets.length) {
                for (var i = 0; i < data.tilesets.length; i++) {
                    this.tilesets.push(new TiledTileset_1.TiledTileset(data.tilesets[i], imagePathModifier));
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
        TiledMap.prototype.addLayer = function (layerData) {
            var layer = new TiledLayer_1.TiledLayer(this, layerData);
            this.layers.push(layer);
            this.layersByName[layer.name] = layer;
            if (layer.isObjectGroup()) {
                this.objectGroups.push(layer);
            }
        };
        TiledMap.prototype.draw = function (ctx, centerRow, centerCol, dx, dy) {
            if (dx === void 0) { dx = 0; }
            if (dy === void 0) { dy = 0; }
            var colCount = this.colCount;
            var rowCount = this.rowCount;
            var screenCols = this.screenRows;
            var screenRows = this.screenCols;
            var tileW = this.tileWidth;
            var tileH = this.tileHeight;
            var tileSize = tileW; // Assumes square tiles (!).  Fix me one day
            var screenWidth = this.screenWidth;
            var screenHeight = this.screenHeight;
            var col0 = centerCol - Math.floor(screenCols / 2);
            if (col0 < 0) {
                col0 += colCount;
            }
            var row0 = centerRow - Math.floor(screenRows / 2);
            if (row0 < 0) {
                row0 += rowCount;
            }
            // Center point of screen, in map x,y coordinates.
            var cx = centerCol * tileW + dx + tileW / 2;
            var cy = centerRow * tileH + dy + tileH / 2;
            // Top-left of screen, in map x,y coordinates.
            var x0 = cx - screenWidth / 2;
            var y0 = cy - screenHeight / 2;
            var topLeftCol = Math.floor(x0 / tileW);
            if ((x0 % tileSize) < 0) {
                topLeftCol--;
            }
            var tileEdgeX = topLeftCol * tileW;
            var topLeftRow = Math.floor(y0 / tileH);
            if ((y0 % tileSize) < 0) {
                topLeftRow--;
            }
            var tileEdgeY = topLeftRow * tileH; // getTileEdge(topLeftY);
            // The view coordinates at which to start painting.
            var startX = tileEdgeX - x0;
            var _x = startX;
            var startY = tileEdgeY - y0;
            var _y = startY;
            if (topLeftCol < 0) {
                topLeftCol += colCount;
            }
            if (topLeftRow < 0) {
                topLeftRow += rowCount;
            }
            // Paint until the end of the screen
            var row = topLeftRow;
            var layerCount = this.getLayerCount();
            var tileCount = 0;
            while (_y < screenHeight) {
                for (var l = 0; l < layerCount; l++) {
                    var col = topLeftCol;
                    _x = startX;
                    var layer = this.getLayerByIndex(l);
                    if (layer.visible) {
                        var prevOpacity = 1; // Default value needed for strict null checks
                        if (layer.opacity < 1) {
                            prevOpacity = ctx.globalAlpha;
                            ctx.globalAlpha = prevOpacity * layer.opacity;
                        }
                        while (_x < screenWidth) {
                            var value = layer.getData(row % rowCount, col % colCount);
                            this.drawTile(ctx, _x, _y, value, layer);
                            tileCount++;
                            _x += tileW;
                            col++;
                        }
                        if (layer.opacity < 1) {
                            ctx.globalAlpha = prevOpacity;
                        }
                    }
                }
                _y += tileH;
                row++;
            }
            //console.log('tileCount === ' + tileCount);
        };
        /**
         * Returns a layer by name.
         *
         * @param {string} name The name of the layer.
         * @return {TiledLayer} The layer, or null if there is no layer with
         *         that name.
         * @method
         */
        TiledMap.prototype.getLayer = function (name) {
            return this.layersByName[name];
        };
        /**
         * Returns a layer by index.
         *
         * @param {int} index The index of the layer.
         * @return {TiledLayer} The layer, or null if there is no layer at
         *         that index.
         * @method
         */
        TiledMap.prototype.getLayerByIndex = function (index) {
            return this.layers[index];
        };
        /**
         * Returns the number of layers in this map.
         *
         * @return {int} The number of layers in this map.
         */
        TiledMap.prototype.getLayerCount = function () {
            return this.layers.length;
        };
        TiledMap.prototype._getImageForGid = function (gid) {
            var tilesetCount = this.tilesets.length;
            for (var i = 0; i < tilesetCount; i++) {
                if (this.tilesets[i].firstgid > gid) {
                    return this.tilesets[i - 1];
                }
            }
            return this.tilesets[tilesetCount - 1];
        };
        TiledMap.prototype.drawTile = function (ctx, x, y, value, layer) {
            if (value <= 0) {
                return;
            }
            var tileset = this._getImageForGid(value);
            if (!tileset) {
                console.log('null tileset for: ' + value + ' (layer ' + layer.name + ')');
                return;
            }
            value -= tileset.firstgid;
            if (value < 0) {
                return;
            }
            var gameWindow = window;
            var game = gameWindow.game;
            var img = game.assets.getTmxTilesetImage(tileset);
            var tileW = this.tileWidth;
            var sw = tileW + tileset.spacing;
            var tileH = this.tileHeight;
            var sh = tileH + tileset.spacing;
            // TODO: "+ 1" is based on extra space at end of image.  Should be configured/calculated
            var imgColCount = Math.floor(img.width / sw);
            if (tileset.spacing > 0 && ((img.width % sw) === tileW)) {
                imgColCount++;
            }
            var imgY = Math.floor(value / imgColCount) * sh;
            var imgX = (value % imgColCount) * sw;
            //ctx.drawImage(img, imgX,imgY,tileW,tileH, x,y,tileW,tileH);
            img.drawScaled2(ctx, imgX, imgY, tileW, tileH, x, y, tileW, tileH);
        };
        TiledMap.prototype.setScale = function (scale) {
            this.tileWidth *= scale;
            this.tileHeight *= scale;
            this.screenRows = Math.ceil(this.screenHeight / this.tileHeight);
            this.screenCols = Math.ceil(this.screenWidth / this.tileWidth);
            var tilesetCount = this.tilesets.length;
            for (var i = 0; i < tilesetCount; i++) {
                return this.tilesets[i].setScale(scale);
            }
        };
        /**
         * Returns the pixel width of this map.
         *
         * @return {int} The pixel width of this map.
         * @method
         */
        TiledMap.prototype.getPixelWidth = function () {
            return this.colCount * this.tileWidth;
        };
        /**
         * Returns the pixel height of this map.
         *
         * @return {int} The pixel height of this map.
         * @method
         */
        TiledMap.prototype.getPixelHeight = function () {
            return this.rowCount * this.tileHeight;
        };
        /**
         * Removes a layer from this map.
         * @param {string} layerName The name of the layer to remove.
         * @return {boolean} Whether a layer by that name was found.
         * @method
         */
        TiledMap.prototype.removeLayer = function (layerName) {
            for (var i = 0; i < this.layers.length; i++) {
                if (this.layers[i].name === layerName) {
                    this.layers.splice(i, 1);
                    delete this.layersByName[layerName];
                    for (var j = 0; j < this.objectGroups.length; j++) {
                        if (this.objectGroups[j].name === layerName) {
                            delete this.objectGroups[j];
                        }
                    }
                }
                return true;
            }
            return false;
        };
        return TiledMap;
    }());
    exports.TiledMap = TiledMap;
});
define("gtp/AssetLoader", ["require", "exports", "gtp/SpriteSheet", "gtp/AssetType", "gtp/Utils", "gtp/ImageUtils", "gtp/Image", "gtp/Sound"], function (require, exports, SpriteSheet_1, AssetType_1, Utils_5, ImageUtils_3, Image_1, Sound_1) {
    "use strict";
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
    var AssetLoader = (function () {
        /**
         * Provides methods to load images, sounds, and Tiled maps.
         *
         * @param {number} scale How much to scale image resources.
         * @param {AudioSystem} audio A web audio context.
         * @param {string} [assetRoot] If specified, this is the implicit root
         *        directory for all assets to load.  Use this if all assets are
         *        in a subfolder or different hierarchy than the project itself.
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
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} [url=id] The URL of the resource, defaulting to
         *        {@code id} if not specified.
         */
        AssetLoader.prototype.addJson = function (id, url) {
            var _this = this;
            if (url === void 0) { url = id; }
            if (this._assetRoot) {
                url = this._assetRoot + url;
            }
            if (this._isAlreadyTracked(id)) {
                return;
            }
            this.loadingAssetData[id] = { type: AssetType_1.AssetType.JSON };
            console.log('Adding: ' + id + ' => ' + url +
                ', remaining == ' + Utils_5.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var response = xhr.responseText;
                    _this._completed(id, response);
                }
            };
            xhr.open('GET', url, true);
            xhr.send(null);
        };
        /**
         * Starts loading a canvas resource.
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} imageSrc The URL of the resource.
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
            this.loadingAssetData[id] = { type: AssetType_1.AssetType.IMAGE };
            console.log('Adding: ' + id + ' => ' + imageSrc +
                ', remaining == ' + Utils_5.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            image.addEventListener('load', function () {
                var canvas = ImageUtils_3.ImageUtils.resize(image, self._scale);
                self._completed(id, canvas);
            });
            image.src = imageSrc;
        };
        /**
         * Starts loading an image resource.
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} imageSrc The URL of the resource.
         * @param {boolean} firstPixelTranslucent If truthy, the pixel at (0, 0)
         *        is made translucent, along with all other pixels of the same
         *        color.  The default value is <code>false</code>.
         */
        AssetLoader.prototype.addImage = function (id, imageSrc, firstPixelTranslucent) {
            if (firstPixelTranslucent === void 0) { firstPixelTranslucent = false; }
            if (this._assetRoot) {
                imageSrc = this._assetRoot + imageSrc;
            }
            var self = this;
            var image = document.createElement('img'); //new Image();
            if (this._isAlreadyTracked(id)) {
                return;
            }
            this.loadingAssetData[id] = { type: AssetType_1.AssetType.IMAGE };
            console.log('Adding: ' + id + ' => ' + imageSrc +
                ', remaining == ' + Utils_5.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            image.addEventListener('load', function () {
                var canvas = ImageUtils_3.ImageUtils.resize(image, self._scale);
                var gtpImage = new Image_1.Image(canvas);
                if (firstPixelTranslucent) {
                    gtpImage.makeColorTranslucent(0, 0);
                }
                self._completed(id, gtpImage);
            });
            image.src = imageSrc;
        };
        /**
         * Starts loading a sound resource.
         * @param {string} id The ID to use when retrieving this resource.
         * @param {string} soundSrc The URL of the resource.
         * @param {number} [loopStart=0] Where to start, in seconds, if/when this
         *        sound loops (which is typical when using a sound as music).
         * @param {boolean} [loopByDefaultIfMusic=true] Whether this sound should
         *        loop by default when it is played as music.
         */
        AssetLoader.prototype.addSound = function (id, soundSrc, loopStart, loopByDefaultIfMusic) {
            var _this = this;
            if (loopStart === void 0) { loopStart = 0; }
            if (loopByDefaultIfMusic === void 0) { loopByDefaultIfMusic = true; }
            if (this.audio.isInitialized()) {
                if (this._isAlreadyTracked(id)) {
                    return;
                }
                this.loadingAssetData[id] = { type: AssetType_1.AssetType.AUDIO };
                if (this._assetRoot) {
                    soundSrc = this._assetRoot + soundSrc;
                }
                var xhr_1 = new XMLHttpRequest();
                xhr_1.onload = function () {
                    // TODO: Clean up this API
                    _this.audio.context.decodeAudioData(xhr_1.response, function (buffer) {
                        var sound = new Sound_1.Sound(id, buffer, loopStart || 0);
                        if (typeof loopByDefaultIfMusic !== 'undefined') {
                            sound.setLoopsByDefaultIfMusic(loopByDefaultIfMusic);
                        }
                        _this.audio.addSound(sound);
                        _this._completed(id, buffer);
                    });
                };
                xhr_1.open('GET', soundSrc, true);
                xhr_1.responseType = 'arraybuffer';
                xhr_1.send(null);
            }
        };
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
            this.loadingAssetData[id] = { type: AssetType_1.AssetType.IMAGE };
            console.log('Adding: ' + id + ' => ' + imageSrc +
                ', remaining == ' + Utils_5.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            image.addEventListener('load', function () {
                var canvas = ImageUtils_3.ImageUtils.resize(image, self._scale);
                var gtpImage = new Image_1.Image(canvas);
                if (firstPixelTranslucent) {
                    gtpImage.makeColorTranslucent(0, 0);
                }
                var ss = new SpriteSheet_1.SpriteSheet(gtpImage, cellW, cellH, spacingX, spacingY);
                self._completed(id, ss);
            });
            image.src = imageSrc;
        };
        /**
         * Registers all images needed by the TMX map's tilesets to this asset
         * loader.
         *
         * @param {TiledMap} map The Tiled map.
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
         * @param {TiledTileset} tileset The tile set.
         * @return {Image} The tileset image.
         */
        AssetLoader.prototype.getTmxTilesetImage = function (tileset) {
            return this.responses['_tilesetImage_' + tileset.name];
        };
        /**
         * Retrieves a resource by ID.
         * @param {string} res The ID of the resource.
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
            return false;
        };
        /**
         * Adds a resource.
         * @param {string} res The ID for the resource.
         * @param {any} value The resource value.
         */
        AssetLoader.prototype.set = function (res, value) {
            this.responses[res] = value;
        };
        AssetLoader.prototype._completed = function (res, response) {
            if (!this.loadingAssetData[res]) {
                console.error('Resource not found! - ' + res);
                return;
            }
            if (this.loadingAssetData[res].type === AssetType_1.AssetType.JSON) {
                response = JSON.parse(response);
            }
            this.responses[res] = response;
            delete this.loadingAssetData[res];
            console.log('Completed: ' + res + ', remaining == ' +
                Utils_5.Utils.getObjectSize(this.loadingAssetData) +
                ', callback == ' + (this.callback !== null));
            if (this.isDoneLoading() && this.callback) {
                this.callback.call();
                delete this.callback;
                console.log('... Callback called and deleted (callback == ' + (this.callback !== null) + ')');
                if (this.nextCallback) {
                    this.callback = this.nextCallback;
                    delete this.nextCallback;
                }
            }
            else {
                console.log('... Not running callback - ' + this.isDoneLoading() + ', ' + (this.callback !== null));
            }
        };
        /**
         * Returns whether all assets in this loader have successfully loaded.
         *
         * @return {boolean} Whether all assets have loaded.
         */
        AssetLoader.prototype.isDoneLoading = function () {
            return Utils_5.Utils.getObjectSize(this.loadingAssetData) === 0;
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
    }());
    exports.AssetLoader = AssetLoader;
});
define("gtp/AssetLoader.spec", ["require", "exports", "gtp/AssetLoader", "gtp/AudioSystem"], function (require, exports, AssetLoader_2, AudioSystem_2) {
    "use strict";
    describe('AssetLoader', function () {
        'use strict';
        beforeEach(function () {
            jasmine.Ajax.install();
        });
        afterEach(function () {
            jasmine.Ajax.uninstall();
        });
        it('constructor, happy path', function () {
            new AssetLoader_2.AssetLoader(1, new AudioSystem_2.AudioSystem()); // tslint:disable-line
        });
        it('isDoneLoading() works', function () {
            // Initially nothing queued up, so we're "done loading"
            var assetLoader = new AssetLoader_2.AssetLoader(1, new AudioSystem_2.AudioSystem());
            expect(assetLoader.isDoneLoading()).toBeTruthy();
            // Add something to load, now we're waiting
            assetLoader.addJson('testJson', '/fake/url.json');
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('/fake/url.json');
            expect(assetLoader.isDoneLoading()).toBeFalsy();
            // Mock a response, which triggers AssetLoader to receive the response as well
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: '{ "data": 1 }'
            });
            // Now that we've received the response, check that we're "done loading" again
            expect(assetLoader.isDoneLoading()).toBeTruthy();
        });
    });
});
define("gtp/BitmapFont", ["require", "exports", "gtp/SpriteSheet"], function (require, exports, SpriteSheet_2) {
    "use strict";
    var BitmapFont = (function (_super) {
        __extends(BitmapFont, _super);
        function BitmapFont(gtpImage, cellW, cellH, spacing, spacingY) {
            _super.call(this, gtpImage, cellW, cellH, spacing, spacingY);
        }
        BitmapFont.prototype.drawString = function (str, x, y) {
            var glyphCount = this.size;
            var gameWindow = window;
            var ctx = gameWindow.game.canvas.getContext('2d');
            var charWidth = this.cellW;
            for (var i = 0; i < str.length; i++) {
                var ch = str.charCodeAt(i) - 0x20;
                if (ch < 0 || ch >= glyphCount) {
                    ch = 0;
                }
                this.drawByIndex(ctx, x, y, ch);
                x += charWidth;
            }
        };
        return BitmapFont;
    }(SpriteSheet_2.SpriteSheet));
    exports.BitmapFont = BitmapFont;
});
define("gtp/Delay", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A way to keep track of a delay.  Useful when you want some event to occur
     * every X milliseconds, for example.
     *
     * @param {object} args Arguments to this delay.
     * @param {number-or-array} args.millis The number of milliseconds between
     *        events.  You can specify an array of numbers to have the even trigger
     *        at non-equal intervals.
     * @param {int} [args.minDelta] If specified, a minimum amount of variance for
     *        the event.  May be negative, but should be larger than the smallest
     *        value specified in millis.
     * @param {int} [args.maxDelta] If specified, a maximum amount of variance for
     *        the event.
     * @param {int} [args.loop] If specified and <code>true</code>, this timer will
     *        automatically repeat and <code>isDone()</code> will never return
     *        <code>true</code>.
     * @param {int} [args.loopCount] This argument is only honored if
     *        <code>args.loop</code> is defined and <code>true</code>.  If true,
     *        this argument is the number of times to loop; if this argument is not
     *        specified, looping will occur indefinitely.
     * @param {function} [args.callback] If specified, a callback function that
     *        will be called when this delay fires.
     * @constructor
     */
    var Delay = (function () {
        function Delay(args) {
            if (!args || !args.millis) {
                throw 'Missing required "millis" argument to Delay';
            }
            this._initial = args.millis.length ? args.millis : [args.millis];
            this._initialIndex = 0;
            if (args.minDelta && args.maxDelta) {
                this.setRandomDelta(args.minDelta, args.maxDelta);
            }
            this._callback = args.callback;
            this._loop = !!args.loop;
            this._loopCount = 0;
            this._maxLoopCount = this._loop ? (args.loopCount || -1) : -1;
            this.reset();
        }
        /**
         * Should be called in the update() method of the current game state to
         * update this Delay.
         *
         * @param {int} delta The time that has elapsed since the last call to this
         *        method.
         */
        Delay.prototype.update = function (delta) {
            if (this._remaining > 0) {
                this._remaining -= delta;
                if (this._remaining <= 0 && this._callback) {
                    this._callback(this);
                }
            }
            if (this._remaining <= 0) {
                if (this._loop) {
                    if (this._maxLoopCount === -1 || this._loopCount < this._maxLoopCount - 1) {
                        this._loopCount++;
                        this.reset(true);
                    }
                    else {
                        this._loopCount = this._maxLoopCount;
                        this._remaining = -1;
                    }
                }
                else {
                    this._remaining = Math.max(0, this._remaining);
                }
            }
            return this.isDone();
        };
        /**
         * Returns the number of times this Delay has looped.
         *
         * @return {int} The number of times this Delay has looped.
         */
        Delay.prototype.getLoopCount = function () {
            return this._loopCount;
        };
        /**
         * Returns the maximum delta value, or -1 if none was defined.
         *
         * @return {int} The maximum delta value.
         * @see getMinDelta()
         */
        Delay.prototype.getMaxDelta = function () {
            return typeof this._maxDelta !== 'undefined' ? this._maxDelta : -1;
        };
        /**
         * Returns the minimum delta value, or -1 if none was defined.
         *
         * @return {int} The minimum delta value.
         * @see getMaxDelta()
         */
        Delay.prototype.getMinDelta = function () {
            return typeof this._minDelta !== 'undefined' ? this._minDelta : -1;
        };
        /**
         * Returns the remaining time on this delay.
         *
         * @return {int} The remaining time on this delay.
         */
        Delay.prototype.getRemaining = function () {
            return this._remaining;
        };
        /**
         * Returns how far along we are in this delay, in the range
         * 0 - 1.
         *
         * @return {int} How far along we are in this delay.
         */
        Delay.prototype.getRemainingPercent = function () {
            return this._remaining / this._curInitial;
        };
        /**
         * Returns whether this Delay has completed.
         *
         * @return {boolean} Whether this Delay has completed.
         */
        Delay.prototype.isDone = function () {
            return (!this._loop || this._loopCount === this._maxLoopCount) &&
                this._remaining <= 0;
        };
        /**
         * Causes this delay to trigger with a little random variance.
         *
         * @param {int} min The minimum possible variance, inclusive.
         * @param {int} max The maximum possible variance, exclusive.
         */
        Delay.prototype.setRandomDelta = function (min, max) {
            this._minDelta = min;
            this._maxDelta = max;
        };
        Delay.prototype.reset = function (smooth) {
            smooth = !!smooth;
            var prevRemaining = this._remaining;
            this._curInitial = this._remaining = this._initial[this._initialIndex];
            if (smooth && prevRemaining < 0) {
                this._remaining += prevRemaining; // Subtract how much we went over
            }
            this._initialIndex = (this._initialIndex + 1) % this._initial.length;
            if (this._minDelta || this._maxDelta) {
            }
        };
        Delay.prototype.toString = function () {
            return '[Delay: _initial=' + this._initial +
                ', _remaining=' + this._remaining +
                ', _loop=' + this._loop +
                ', _callback=' + (this._callback != null) +
                ']';
        };
        return Delay;
    }());
    exports.Delay = Delay;
});
define("gtp/Delay.spec", ["require", "exports", "gtp/Delay"], function (require, exports, Delay_1) {
    "use strict";
    describe('Delay', function () {
        it('constructor happy path', function () {
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.isDone()).toEqual(false);
            delay.update(50);
            expect(delay.isDone()).toEqual(false);
            delay.update(49);
            expect(delay.isDone()).toEqual(false);
            delay.update(1);
            expect(delay.isDone()).toEqual(true);
        });
        // it('constructor with required arguments not specified', () => {
        // 	expect(() => {
        // 		new Delay(); // tslint:disable-line
        // 	}).toThrow();
        // 	expect(() => {
        // 		new Delay({}); // tslint:disable-line
        // 	}).toThrow();
        // });
        it('constructor with delta specified', function () {
            // No delta specified
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.getMinDelta()).toEqual(-1);
            expect(delay.getMaxDelta()).toEqual(-1);
            // Delta specified
            delay = new Delay_1.Delay({ millis: 100, minDelta: -5, maxDelta: 5 });
            expect(delay.getMinDelta()).toEqual(-5);
            expect(delay.getMaxDelta()).toEqual(5);
        });
        it('update() without a callback', function () {
            // Calling update() with various millis passed until done.
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.isDone()).toEqual(false);
            delay.update(50);
            expect(delay.isDone()).toEqual(false);
            delay.update(49);
            expect(delay.isDone()).toEqual(false);
            delay.update(1);
            expect(delay.isDone()).toEqual(true);
        });
        it('update() calls callback when not looping', function () {
            var callbackCalled = false;
            var cb = function () {
                callbackCalled = true;
            };
            // Calling update() with various millis passed until done.
            var delay = new Delay_1.Delay({ millis: 100, callback: cb });
            expect(callbackCalled).toEqual(false);
            delay.update(50);
            expect(callbackCalled).toEqual(false);
            delay.update(49);
            expect(callbackCalled).toEqual(false);
            delay.update(1);
            expect(callbackCalled).toEqual(true);
        });
        it('update() calls callback when looping', function () {
            var callbackCalled = false;
            var cb = function () {
                callbackCalled = true;
            };
            // Calling update() with various millis passed until done.
            var delay = new Delay_1.Delay({ millis: 100, callback: cb, loop: true });
            expect(callbackCalled).toEqual(false);
            delay.update(50);
            expect(callbackCalled).toEqual(false);
            delay.update(50);
            expect(callbackCalled).toEqual(true);
            callbackCalled = false;
            delay.update(50);
            expect(callbackCalled).toEqual(false);
            delay.update(50);
            expect(callbackCalled).toEqual(true);
            callbackCalled = false;
            delay.update(50);
            expect(callbackCalled).toEqual(false);
            delay.update(50);
            expect(callbackCalled).toEqual(true);
        });
        it('getLoopCount()', function () {
            // Looping not enabled => getLoopCount() always returns 0
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.getLoopCount()).toEqual(0);
            delay.update(100);
            expect(delay.isDone()).toEqual(true);
            expect(delay.getLoopCount()).toEqual(0);
            // Infinite looping => getLoopCount() updates on interval
            delay = new Delay_1.Delay({ millis: 100, loop: true });
            expect(delay.getLoopCount()).toEqual(0);
            delay.update(100);
            expect(delay.isDone()).toEqual(false);
            expect(delay.getLoopCount()).toEqual(1);
            delay.update(50);
            expect(delay.isDone()).toEqual(false);
            expect(delay.getLoopCount()).toEqual(1);
            delay.update(50);
            expect(delay.isDone()).toEqual(false);
            expect(delay.getLoopCount()).toEqual(2);
            // Fixed loop count => getLoopCount() increments to that number
            delay = new Delay_1.Delay({ millis: 100, loop: true, loopCount: 3 });
            expect(delay.isDone()).toEqual(false);
            expect(delay.getLoopCount()).toEqual(0);
            delay.update(100);
            expect(delay.isDone()).toEqual(false);
            expect(delay.getLoopCount()).toEqual(1);
            delay.update(50);
            expect(delay.isDone()).toEqual(false);
            expect(delay.getLoopCount()).toEqual(1);
            delay.update(50);
            expect(delay.isDone()).toEqual(false);
            expect(delay.getLoopCount()).toEqual(2);
            delay.update(100);
            expect(delay.isDone()).toEqual(true);
            expect(delay.getLoopCount()).toEqual(3);
            delay.update(100);
            expect(delay.isDone()).toEqual(true);
            expect(delay.getLoopCount()).toEqual(3);
        });
        it('getMaxDelta()', function () {
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.getMaxDelta()).toEqual(-1);
            delay = new Delay_1.Delay({ millis: 100, minDelta: -5, maxDelta: 5 });
            expect(delay.getMaxDelta()).toEqual(5);
        });
        it('getMinDelta()', function () {
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.getMinDelta()).toEqual(-1);
            delay = new Delay_1.Delay({ millis: 100, minDelta: -5, maxDelta: 5 });
            expect(delay.getMinDelta()).toEqual(-5);
        });
        it('getRemaining()', function () {
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.getRemaining()).toEqual(100);
            delay.update(50);
            expect(delay.getRemaining()).toEqual(50);
            delay.update(49);
            expect(delay.getRemaining()).toEqual(1);
            delay.update(1);
            expect(delay.getRemaining()).toEqual(0);
        });
        it('getRemainingPercent()', function () {
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.getRemainingPercent()).toEqual(1);
            delay.update(50);
            expect(delay.getRemainingPercent()).toEqual(0.5);
            delay.update(49);
            expect(delay.getRemainingPercent()).toEqual(0.01);
            delay.update(1);
            expect(delay.getRemaining()).toEqual(0);
        });
        it('isDone()', function () {
            // Verify isDone() only returns true when total delay has passed.
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.isDone()).toEqual(false);
            delay.update(50);
            expect(delay.isDone()).toEqual(false);
            delay.update(49);
            expect(delay.isDone()).toEqual(false);
            delay.update(1);
            expect(delay.isDone()).toEqual(true);
        });
        it('setRandomDelta()', function () {
            // Initially, no random delta
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.getMinDelta()).toEqual(-1);
            expect(delay.getMaxDelta()).toEqual(-1);
            // Setting a random delta
            delay.setRandomDelta(-7, 7);
            expect(delay.getMinDelta()).toEqual(-7);
            expect(delay.getMaxDelta()).toEqual(7);
        });
        it('reset(smooth=true)', function () {
            var delay = new Delay_1.Delay({ millis: 100, loop: true });
            expect(delay.getRemaining()).toEqual(100);
            delay.update(105); // Calls reset(true)
            expect(delay.getRemaining()).toEqual(95);
        });
        it('toString()', function () {
            var delay = new Delay_1.Delay({ millis: 100 });
            expect(delay.toString()).toEqual('[Delay: _initial=100' +
                ', _remaining=100' +
                ', _loop=false' +
                ', _callback=false' +
                ']');
        });
    });
});
define("gtp/FadeOutInState", ["require", "exports", "gtp/State"], function (require, exports, State_1) {
    "use strict";
    var FadeOutInState = (function (_super) {
        __extends(FadeOutInState, _super);
        /**
         * Fades one state out and another state in.
         *
         * @constructor
         */
        function FadeOutInState(leavingState, enteringState, transitionLogic, timeMillis) {
            _super.call(this);
            this._leavingState = leavingState;
            this._enteringState = enteringState;
            this._transitionLogic = transitionLogic;
            this._fadingOut = true;
            this._alpha = 1;
            this._halfTime = timeMillis && timeMillis > 0 ? timeMillis / 2 : 800;
            this._curTime = 0;
        }
        FadeOutInState.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
            //         console.log('delta === ' + delta);
            this._curTime += delta;
            if (this._curTime >= this._halfTime) {
                this._curTime -= this._halfTime;
                if (this._fadingOut) {
                    this._fadingOut = false;
                    if (this._transitionLogic) {
                        this._transitionLogic();
                    }
                }
                else {
                    this._setState(this._enteringState);
                    return;
                }
            }
            if (this._fadingOut) {
                this._alpha = 1 - (this._curTime / this._halfTime);
            }
            else {
                this._alpha = (this._curTime / this._halfTime);
            }
        };
        FadeOutInState.prototype.render = function (ctx) {
            _super.prototype.render.call(this, ctx);
            this.game.clearScreen();
            var previousAlpha = ctx.globalAlpha;
            ctx.globalAlpha = this._alpha;
            if (this._fadingOut) {
                this._leavingState.render(ctx);
            }
            else {
                this._enteringState.render(ctx);
            }
            ctx.globalAlpha = previousAlpha;
        };
        /**
         * Sets the new game state.  This is a hook for subclasses to perform
         * extra logic.
         *
         * @param state The new state.
         */
        FadeOutInState.prototype._setState = function (state) {
            this.game.setState(this._enteringState);
        };
        return FadeOutInState;
    }(State_1.State));
    exports.FadeOutInState = FadeOutInState;
});
define("gtp/FadeOutInState.spec", ["require", "exports", "gtp/FadeOutInState", "gtp/State"], function (require, exports, FadeOutInState_1, State_2) {
    "use strict";
    describe('FadeOutInState', function () {
        'use strict';
        it('constructor happy path', function () {
            var leavingState = new State_2.State();
            var enteringState = new State_2.State();
            var temp = {
                transitionLogic: function () {
                }
            };
            var timeMillis = 500;
            spyOn(temp, 'transitionLogic');
            var state = new FadeOutInState_1.FadeOutInState(leavingState, enteringState, temp.transitionLogic, timeMillis);
            expect(state).toBeDefined();
            expect(temp.transitionLogic).not.toHaveBeenCalled();
        });
        it('transitionLogic is called at halfway point', function () {
            var leavingState = new State_2.State();
            var enteringState = new State_2.State();
            var temp = {
                transitionLogic: function () {
                }
            };
            var timeMillis = 500;
            spyOn(temp, 'transitionLogic');
            var state = new FadeOutInState_1.FadeOutInState(leavingState, enteringState, temp.transitionLogic, timeMillis);
            expect(temp.transitionLogic).not.toHaveBeenCalled();
            state.update(timeMillis / 2 - 1);
            expect(temp.transitionLogic).not.toHaveBeenCalled();
            state.update(1);
            expect(temp.transitionLogic).toHaveBeenCalled();
        });
    });
});
define("gtp/Image.spec", ["require", "exports", "gtp/Image"], function (require, exports, Image_2) {
    "use strict";
    describe('Image', function () {
        'use strict';
        it('constructor happy path - 1 arg', function () {
            var canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 50;
            var image = new Image_2.Image(canvas);
            expect(image.width).toEqual(canvas.width);
            expect(image.height).toEqual(canvas.height);
            expect(image.x).toEqual(0);
            expect(image.y).toEqual(0);
        });
        it('constructor happy path - 5 args', function () {
            var canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 50;
            var image = new Image_2.Image(canvas, 2, 2, 20, 20);
            expect(image.width).toEqual(20);
            expect(image.height).toEqual(20);
            expect(image.x).toEqual(2);
            expect(image.y).toEqual(2);
        });
    });
});
define("gtp/ImageAtlas", ["require", "exports", "gtp/Image", "gtp/ImageUtils"], function (require, exports, Image_3, ImageUtils_4) {
    "use strict";
    var ImageAtlas = (function () {
        function ImageAtlas(args) {
            this._atlasInfo = args.atlasInfo;
            this._masterCanvas = args.canvas;
            if (this._atlasInfo.firstPixelIsTranslucent) {
                this._masterCanvas = ImageUtils_4.ImageUtils.makeColorTranslucent(this._masterCanvas);
            }
        }
        ImageAtlas.prototype.parse = function () {
            var images = {};
            var self = this;
            this._atlasInfo.images.forEach(function (imgInfo) {
                var id = imgInfo.id;
                var dim;
                if (imgInfo.dim) {
                    dim = imgInfo.dim.split(/,\s*/);
                    if (dim.length !== 4) {
                        throw new Error('Invalid value for imgInfo.dim: ' + imgInfo.dim);
                    }
                }
                else {
                    dim = [];
                    dim.push(imgInfo.x, imgInfo.y, imgInfo.w, imgInfo.h);
                }
                dim = dim.map(function (str) {
                    return parseInt(str, 10) * 2;
                });
                images[id] = new Image_3.Image(self._masterCanvas, dim[0], dim[1], dim[2], dim[3]);
            });
            return images;
        };
        return ImageAtlas;
    }());
    exports.ImageAtlas = ImageAtlas;
});
define("gtp/Point", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A simple x-y coordinate.
     */
    var Point = (function () {
        /**
         * Creates a <code>Point</code> instance.
         * @param {number} x The x-coordinate, or <code>0</code> if unspecified.
         * @param {number} y The y-coordinate, or <code>0</code> if unspecified.
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        /**
         * Returns whether this point is equal to another one.
         * @param {Point} other The point to compare to, which may be
         *        <code>null</code>.
         * @return Whether the two points are equal.
         */
        Point.prototype.equals = function (other) {
            return other != null && this.x === other.x && this.y === other.y;
        };
        return Point;
    }());
    exports.Point = Point;
});
define("gtp/Point.spec", ["require", "exports", "gtp/Point"], function (require, exports, Point_1) {
    "use strict";
    describe('Point', function () {
        'use strict';
        it('constructor 0-arg', function () {
            var point = new Point_1.Point();
            expect(point.x).toBe(0);
            expect(point.y).toBe(0);
        });
        it('constructor 1-arg', function () {
            var point = new Point_1.Point(3);
            expect(point.x).toBe(3);
            expect(point.y).toBe(0);
        });
        it('constructor 2-arg', function () {
            var point = new Point_1.Point(3, 4);
            expect(point.x).toBe(3);
            expect(point.y).toBe(4);
        });
        it('equals null arg', function () {
            var point = new Point_1.Point(3, 4);
            expect(point.equals(null)).toBeFalsy();
        });
        it('equals false', function () {
            var point = new Point_1.Point(3, 4);
            var point2 = new Point_1.Point(3, 5);
            expect(point.equals(point2)).toBeFalsy();
        });
        it('equals true', function () {
            var point = new Point_1.Point(3, 4);
            var point2 = new Point_1.Point(3, 4);
            expect(point.equals(point2)).toBeTruthy();
            expect(point.equals(point)).toBeTruthy();
        });
    });
});
define("gtp/Pool", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * An object pool.	Useful if your game creates lots of very small
     * objects of the same type each frame, such as a path-finding algorithm.
     * <p>
     * NOTE: The <code>returnObj()</code> method may take linear time;
     * it's much more efficient to use <code>reset()</code> if possible.
     */
    var Pool = (function () {
        /**
         * Creates an object pool.
         * @param {Function} ctorFunc The constructor function for <code>T</code>
         *        instances.
         * @param {number} initialSize The initial size of the pool; defaults to
         *        <code>20</code>.
         * @param {number} growCount The amount to grow this pool by if too many
         *        objects are borrowed; defaults to <code>10</code>.
         */
        function Pool(ctorFunc, initialSize, growCount) {
            if (initialSize === void 0) { initialSize = 20; }
            if (growCount === void 0) { growCount = 10; }
            this._c = ctorFunc;
            this._pool = [];
            for (var i = 0; i < initialSize; i++) {
                this._pool.push(new this._c());
            }
            this._index = 0;
            this._growCount = growCount;
        }
        /**
         * Gets an object from this pool.
         * @return {T} An object from this pool.
         * @see returnObj
         */
        Pool.prototype.borrowObj = function () {
            var obj = this._pool[this._index++];
            if (this._index >= this._pool.length) {
                for (var i = 0; i < this._growCount; i++) {
                    this._pool.push(new this._c());
                }
            }
            return obj;
        };
        Object.defineProperty(Pool.prototype, "borrowedCount", {
            /**
             * Returns the number of currently-borrowed objects.
             * @return {number} The number of currently-borrowed objects.
             */
            get: function () {
                return this._index;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Acts as if all objects have been returned to this pool.	This method
         * should be used if you're implementing an algorithm that uses an
         * arbitrary number of objects, and just want to return them all when you
         * are done.
         * @see returnObj
         */
        Pool.prototype.reset = function () {
            this._index = 0;
        };
        /**
         * Returns an object to this pool.
         * @param {T} obj The object to return.
         * @return {boolean} <code>true</code>, assuming the object was actually
         *         from this pool, and not previously returned.	In other words,
         *         this method will only return <code>false</code> if you try to
         *         incorrectly return an object.
         * @see borrowObj
         * @see reset
         */
        Pool.prototype.returnObj = function (obj) {
            // Get the index of the object being returned.
            var objIndex = -1;
            for (var i = 0; i < this._index; i++) {
                if (obj === this._pool[i]) {
                    objIndex = i;
                    break;
                }
            }
            if (objIndex === -1) {
                return false;
            }
            // Swap it with the most-recently borrowed object and move our index back
            var temp = this._pool[--this._index];
            this._pool[this._index] = this._pool[objIndex];
            this._pool[objIndex] = temp;
            return true;
        };
        Object.defineProperty(Pool.prototype, "length", {
            /**
             * Returns the total number of pooled objects, borrowed or otherwise.
             * Only really useful for debugging purposes.
             * @return {number} The total number of objects in this pool.
             */
            get: function () {
                return this._pool.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns this object as a string.	Useful for debugging.
         * @return {string} A string representation of this pool.
         */
        Pool.prototype.toString = function () {
            return '[Pool: ' +
                'borrowed=' + this.borrowedCount +
                ', size=' + this.length +
                ']';
        };
        return Pool;
    }());
    exports.Pool = Pool;
});
define("gtp/Pool.spec", ["require", "exports", "gtp/Pool"], function (require, exports, Pool_1) {
    "use strict";
    describe('Pool', function () {
        'use strict';
        function Widget() {
            this.type = null;
            this.price = 0;
        }
        it('constructor, 0-arg', function () {
            var pool = new Pool_1.Pool(Widget.prototype.constructor);
            expect(pool.borrowedCount).toBe(0);
            expect(pool.length).toBe(20);
        });
        it('constructor, 1-arg', function () {
            var pool = new Pool_1.Pool(Widget.prototype.constructor, 50);
            expect(pool.borrowedCount).toBe(0);
            expect(pool.length).toBe(50);
        });
        it('borrowObj() happy path', function () {
            var pool = new Pool_1.Pool(Widget.prototype.constructor);
            expect(pool.borrowedCount).toBe(0);
            var widget = pool.borrowObj();
            expect(pool.borrowedCount).toBe(1);
            expect(widget.type).toBeNull();
            expect(widget.price).toBe(0);
            pool.returnObj(widget);
            expect(pool.borrowedCount).toBe(0);
        });
        it('borrowObj() until pool grown', function () {
            var growCount = 7;
            var pool = new Pool_1.Pool(Widget.prototype.constructor, 3, growCount);
            expect(pool.borrowedCount).toBe(0);
            pool.borrowObj();
            pool.borrowObj();
            pool.borrowObj();
            expect(pool.borrowedCount).toBe(3);
            expect(pool.length).toBe(3 + growCount);
        });
        it('returnObj() happy path', function () {
            var pool = new Pool_1.Pool(Widget.prototype.constructor);
            expect(pool.borrowedCount).toBe(0);
            var widget = pool.borrowObj();
            expect(pool.borrowedCount).toBe(1);
            expect(widget.type).toBeNull();
            expect(widget.price).toBe(0);
            var result = pool.returnObj(widget);
            expect(result).toBeTruthy();
            expect(pool.borrowedCount).toBe(0);
        });
        it('returnObj() invalid object', function () {
            var pool = new Pool_1.Pool(Widget.prototype.constructor);
            expect(pool.borrowedCount).toBe(0);
            var result = pool.returnObj('hello world');
            expect(result).toBeFalsy();
            expect(pool.borrowedCount).toBe(0);
        });
        it('reset() happy path', function () {
            var pool = new Pool_1.Pool(Widget.prototype.constructor);
            expect(pool.borrowedCount).toBe(0);
            pool.borrowObj();
            pool.borrowObj();
            pool.borrowObj();
            expect(pool.borrowedCount).toBe(3);
            pool.reset();
            expect(pool.borrowedCount).toBe(0);
        });
        it('toString()', function () {
            var pool = new Pool_1.Pool(Widget.prototype.constructor);
            var actual = pool.toString();
            expect(actual).toBe('[Pool: borrowed=0, size=20]');
        });
    });
});
define("gtp/Rectangle", ["require", "exports"], function (require, exports) {
    "use strict";
    var Rectangle = (function () {
        /**
         * A simple rectangle class, containing some useful utility methods.
         *
         * @constructor
         * @param {int} x The x-coordinate, defaulting to <code>0</code>.
         * @param {int} y The y-coordinate, defaulting to <code>0</code>.
         * @param {int} w The width of the rectangle, defaulting to <code>0</code>.
         * @param {int} h The height of the rectangle, defaulting to <code>0</code>.
         */
        function Rectangle(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.set(x, y, w, h);
        }
        /**
         * Returns whether one rectangle contains another.
         *
         * @param {number|Rectangle} x2 Either a second rectangle, or the
         *        x-coordinate of the second rectangle.
         * @param {number} y2 The y-coordinate of the second rectangle, if
         *        specifying the dimensions as separate arguments.
         * @param {number} w2 The width of the second rectangle, if
         *        specifying the dimensions as separate arguments.
         * @param {number} h2 The height of the second rectangle, if
         *        specifying the dimensions as separate arguments.
         * @return Whether this rectangle contains the specified rectangle.
         */
        Rectangle.prototype.containsRect = function (x2, y2, w2, h2) {
            if (y2 === void 0) { y2 = 0; }
            if (w2 === void 0) { w2 = 0; }
            if (h2 === void 0) { h2 = 0; }
            if (x2 instanceof Rectangle) {
                var r = x2;
                y2 = r.y;
                w2 = r.w;
                h2 = r.h;
                x2 = r.x;
            }
            var w = this.w;
            var h = this.h;
            if ((w | h | w2 | h2) < 0) {
                // At least one of the dimensions is negative...
                return false;
            }
            // Note: if any dimension is zero, tests below must return false...
            var x = this.x;
            var y = this.y;
            if (x2 < x || y2 < y) {
                return false;
            }
            w += x;
            w2 += x2;
            if (w2 <= x2) {
                // X+W overflowed or W was zero, return false if...
                // either original w or W was zero or
                // x+w did not overflow or
                // the overflowed x+w is smaller than the overflowed X+W
                if (w >= x || w2 > w) {
                    return false;
                }
            }
            else {
                // X+W did not overflow and W was not zero, return false if...
                // original w was zero or
                // x+w did not overflow and x+w is smaller than X+W
                if (w >= x && w2 > w) {
                    return false;
                }
            }
            h += y;
            h2 += y2;
            if (h2 <= y2) {
                if (h >= y || h2 > h) {
                    return false;
                }
            }
            else {
                if (h >= y && h2 > h) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Returns whether this rectangle intersects another.
         *
         * @param {Rectangle} rect2 Another rectangle to compare against.
         *        This should not be null.
         * @return {boolean} Whether the two rectangles intersect.
         */
        Rectangle.prototype.intersects = function (rect2) {
            var tw = this.w;
            var th = this.h;
            var rw = rect2.w;
            var rh = rect2.h;
            if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
                return false;
            }
            var tx = this.x;
            var ty = this.y;
            var rx = rect2.x;
            var ry = rect2.y;
            rw += rx;
            rh += ry;
            tw += tx;
            th += ty;
            //      overflow || intersect
            return ((rw < rx || rw > tx) &&
                (rh < ry || rh > ty) &&
                (tw < tx || tw > rx) &&
                (th < ty || th > ry));
        };
        /**
         * Sets the bounds of this rectangle.
         * @param {number} x The new x-coordinate.
         * @param {number} y The new y-coordinate.
         * @param {number} w The new width.
         * @param {number} h The new height.
         */
        Rectangle.prototype.set = function (x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        };
        return Rectangle;
    }());
    exports.Rectangle = Rectangle;
});
define("gtp/Rectangle.spec", ["require", "exports", "gtp/Rectangle"], function (require, exports, Rectangle_1) {
    "use strict";
    describe('Rectangle', function () {
        'use strict';
        it('0-arg constructor happy path', function () {
            var rect = new Rectangle_1.Rectangle();
            expect(rect.x).toEqual(0);
            expect(rect.y).toEqual(0);
            expect(rect.w).toEqual(0);
            expect(rect.h).toEqual(0);
        });
        it('4-arg constructor happy path', function () {
            var rect = new Rectangle_1.Rectangle(42, 41, 40, 39);
            expect(rect.x).toEqual(42);
            expect(rect.y).toEqual(41);
            expect(rect.w).toEqual(40);
            expect(rect.h).toEqual(39);
        });
        it('containsRect happy path - true', function () {
            var r1 = new Rectangle_1.Rectangle(5, 5, 20, 20);
            var r2 = new Rectangle_1.Rectangle(7, 7, 5, 5);
            expect(r1.containsRect(r2)).toEqual(true);
        });
        it('containsRect happy path - false', function () {
            var r1 = new Rectangle_1.Rectangle(5, 5, 20, 20);
            var r2 = new Rectangle_1.Rectangle(0, 0, 25, 25);
            expect(r1.containsRect(r2)).toEqual(false);
        });
        it('containsRect - identical rectangles', function () {
            var r1 = new Rectangle_1.Rectangle(5, 5, 20, 20);
            var r2 = new Rectangle_1.Rectangle(5, 5, 20, 20);
            expect(r1.containsRect(r2)).toEqual(true);
        });
        it('containsRect - negative width or height', function () {
            var r1 = new Rectangle_1.Rectangle(5, 5, -1, 5);
            var r2 = new Rectangle_1.Rectangle(5, 5, 20, 20);
            expect(r1.containsRect(r2)).toEqual(false);
            expect(r2.containsRect(r1)).toEqual(false);
            r1 = new Rectangle_1.Rectangle(5, 5, 5, -1);
            r2 = new Rectangle_1.Rectangle(5, 5, 20, 20);
            expect(r1.containsRect(r2)).toEqual(false);
            expect(r2.containsRect(r1)).toEqual(false);
        });
        it('containsRect - edge case 1 for coverage', function () {
            // w2 === 0, w1 >= x1
            var r1 = new Rectangle_1.Rectangle(5, 5, 10, 5);
            var r2 = new Rectangle_1.Rectangle(5, 5, 0, 20);
            expect(r1.containsRect(r2)).toEqual(false);
        });
        it('containsRect - edge case 2 for coverage', function () {
            // w2 > x2 && w1 >= x1 && w2 > w1
            var r1 = new Rectangle_1.Rectangle(5, 5, 10, 5);
            var r2 = new Rectangle_1.Rectangle(5, 5, 15, 20);
            expect(r1.containsRect(r2)).toEqual(false);
        });
        it('intersects happy path - false', function () {
            var r1 = new Rectangle_1.Rectangle(0, 0, 20, 20);
            var r2 = new Rectangle_1.Rectangle(50, 50, 4, 4);
            expect(r1.intersects(r2)).toEqual(false);
            expect(r2.intersects(r1)).toEqual(false);
        });
        it('intersects - invalid rect, negative width', function () {
            var r1 = new Rectangle_1.Rectangle(20, 20, -4, -4);
            var r2 = new Rectangle_1.Rectangle(50, 50, 4, 4);
            expect(r1.intersects(r2)).toEqual(false);
            expect(r2.intersects(r1)).toEqual(false);
        });
        it('intersects happy path - true', function () {
            var r1 = new Rectangle_1.Rectangle(0, 0, 20, 20);
            var r2 = new Rectangle_1.Rectangle(10, 10, 20, 20);
            expect(r1.intersects(r2)).toEqual(true);
            expect(r2.intersects(r1)).toEqual(true);
        });
        it('intersects, one containing another', function () {
            var r1 = new Rectangle_1.Rectangle(0, 0, 20, 20);
            var r2 = new Rectangle_1.Rectangle(5, 5, 5, 5);
            expect(r1.intersects(r2)).toEqual(true);
            expect(r2.intersects(r1)).toEqual(true);
        });
        it('set', function () {
            var r1 = new Rectangle_1.Rectangle(0, 0, 20, 20);
            r1.set(5, 6, 7, 8);
            expect(r1.x).toBe(5);
            expect(r1.y).toBe(6);
            expect(r1.w).toBe(7);
            expect(r1.h).toBe(8);
        });
    });
});
define("gtp/StretchMode", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * An enum of available stretch modes for games.  While typically used in desktop games, this can be used
     * in the browser as well, to allow the game to resize as the window is resized, according to their personal
     * preferences.<p>
     *
     * Note that for stretch modes to work, it is assumed that CSS is set up for the application similar to the
     * following, to allow stretching:
     *
     * <pre>
     * * {
     *    margin: 0;
     *    padding: 0;
     * }
     * html, body {
     *    width: 100%;
     *    height: 100%;
     * }
     * </pre>
     *
     * <ul>
     *    <li><code>STRETCH_NONE</code> renders the game in its "native" resolution.
     *    <li><code>STRETCH_FILL</code> makes the canvas fill the parent document.
     *    <li><code>STRETCH_PROPORTIONAL</code> stretches the canvas so it is as large as possible in the
     *       parent document, while maintaining its original aspect ratio.
     * </ul>
     */
    (function (StretchMode) {
        /**
         * No stretching is done.  If the area to paint in is smaller than
         * the game's native resolution, the area painted is clipped.  If the
         * area to paint is larger than the game's native resolution, then
         * the extra area is filled with some solid color (e.g. black or white).
         */
        StretchMode[StretchMode["STRETCH_NONE"] = 0] = "STRETCH_NONE";
        /**
         * The game's graphics are stretched to completely fill the window in
         * which they are being displayed.
         */
        StretchMode[StretchMode["STRETCH_FILL"] = 1] = "STRETCH_FILL";
        /**
         * The game's graphics are stretched so that they fill as much as possible
         * of the window in which they're being displayed, while maintaining their
         * proper aspect ratio.
         */
        StretchMode[StretchMode["STRETCH_PROPORTIONAL"] = 2] = "STRETCH_PROPORTIONAL";
    })(exports.StretchMode || (exports.StretchMode = {}));
    var StretchMode = exports.StretchMode;
    /**
     * Utility methods to allow desktop games to resize to fit their parent document.  Typically, you will
     * register an <code>onresize</code> listener on the document body, and call <code>CanvasResizer.resize()</code>
     * with the appropriate stretch mode parameter.  This allows the user to specify whether they want the game
     * to stretch to fit, keep proportion, or display in its original resolution.<p>
     *
     * Note that for stretch modes to work, it is assumed that CSS is set up for the application similar to the
     * following, to allow stretching:
     *
     * <pre>
     * * {
     *    margin: 0;
     *    padding: 0;
     * }
     * html, body {
     *    width: 100%;
     *    height: 100%;
     * }
     * </pre>
     */
    var CanvasResizer = (function () {
        function CanvasResizer() {
        }
        /**
         * Resizes a canvas to use the specified stretch mode.
         *
         * @param {HTMLCanvasElement} canvas The canvas to resize.
         * @param {StretchMode} stretchMode The stretch mode to apply.
         */
        CanvasResizer.resize = function (canvas, stretchMode) {
            switch (stretchMode) {
                default:
                case StretchMode.STRETCH_NONE:
                    canvas.style.width = canvas.width + 'px';
                    canvas.style.height = canvas.height + 'px';
                    break;
                case StretchMode.STRETCH_FILL:
                    canvas.style.width = document.body.clientWidth + 'px';
                    canvas.style.height = document.body.clientHeight + 'px';
                    break;
                case StretchMode.STRETCH_PROPORTIONAL:
                    var xFactor = document.body.clientWidth / (canvas.width * 1.0);
                    var yFactor = document.body.clientHeight / (canvas.height * 1.0);
                    var factor = Math.min(xFactor, yFactor);
                    canvas.style.width = Math.floor(canvas.width * factor) + 'px';
                    canvas.style.height = Math.floor(canvas.height * factor) + 'px';
                    // Centering should be handled via CSS
                    break;
            }
        };
        return CanvasResizer;
    }());
    exports.CanvasResizer = CanvasResizer;
});
define("gtp/Timer.spec", ["require", "exports", "gtp/Timer"], function (require, exports, Timer_2) {
    "use strict";
    describe('Timer', function () {
        'use strict';
        var debugContent, errorContent;
        beforeEach(function () {
            debugContent = '';
            errorContent = '';
            // Note we are assuming that console.log/error are called with 1 argument
            // here...
            spyOn(console, 'log')
                .and.callFake(function (arg) {
                debugContent += arg + '\n';
            });
            spyOn(console, 'error')
                .and.callFake(function (arg) {
                errorContent += arg + '\n';
            });
        });
        it('logging, happy path, single event', function () {
            var timer = new Timer_2.Timer();
            timer.start('work');
            timer.endAndLog('work');
            expect(debugContent).toMatch(/^DEBUG: work: [\d.]+ ms/);
        });
        it('logging, unknown key passed to endAndLog', function () {
            var timer = new Timer_2.Timer();
            timer.start('work');
            timer.endAndLog('twerk');
            expect(debugContent).toBe('');
            expect(errorContent).toBe('Cannot end timer for "twerk" as it was never started\n');
        });
        it('setLogPrefix, new value', function () {
            var timer = new Timer_2.Timer();
            timer.setLogPrefix('TEST');
            timer.start('work');
            timer.endAndLog('work');
            expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms/);
        });
        it('setLogPrefix, resetting to default', function () {
            var timer = new Timer_2.Timer();
            timer.setLogPrefix('TEST');
            timer.start('work');
            timer.endAndLog('work');
            expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms/);
            timer.setLogPrefix(); // Should reset
            timer.start('work2');
            timer.endAndLog('work2');
            expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms\nDEBUG: work2: [\d.]+ ms/);
        });
    });
});
define("gtp/Utils.spec", ["require", "exports", "gtp/Utils", "gtp/BrowserUtil"], function (require, exports, Utils_6, BrowserUtil_2) {
    "use strict";
    describe('Utils', function () {
        'use strict';
        it('constructor happy path, even though not used', function () {
            var utils = new Utils_6.Utils();
            expect(utils).not.toBeNull();
        });
        it('getObjectSize() happy path', function () {
            var obj = {};
            expect(Utils_6.Utils.getObjectSize(obj)).toBe(0);
            obj = { one: 1, two: 2 };
            expect(Utils_6.Utils.getObjectSize(obj)).toBe(2);
        });
        it('getRequestParam() param found, no values, multiple params', function () {
            spyOn(BrowserUtil_2.BrowserUtil, 'getWindowLocationSearch')
                .and.returnValue('?foo&bar&bas');
            expect(Utils_6.Utils.getRequestParam('foo')).toBe('');
            expect(Utils_6.Utils.getRequestParam('bar')).toBe('');
            expect(Utils_6.Utils.getRequestParam('bas')).toBe('');
        });
        it('getRequestParam() param found, values, multiple params', function () {
            spyOn(BrowserUtil_2.BrowserUtil, 'getWindowLocationSearch')
                .and.returnValue('?foo=fooValue&bar=barValue&bas=basValue');
            expect(Utils_6.Utils.getRequestParam('foo')).toBe('fooValue');
            expect(Utils_6.Utils.getRequestParam('bar')).toBe('barValue');
            expect(Utils_6.Utils.getRequestParam('bas')).toBe('basValue');
        });
        it('getRequestParam() param not found', function () {
            spyOn(BrowserUtil_2.BrowserUtil, 'getWindowLocationSearch')
                .and.returnValue('?foo=fooValue&bar=barValue&bas=basValue');
            expect(Utils_6.Utils.getRequestParam('notFound')).toBeNull();
        });
        it('getRequestParam() param not found, substring of param', function () {
            spyOn(BrowserUtil_2.BrowserUtil, 'getWindowLocationSearch')
                .and.returnValue('?debugMode=true');
            expect(Utils_6.Utils.getRequestParam('debug')).toBeNull();
        });
        it('randomInt(), max only', function () {
            expect(Utils_6.Utils.randomInt(1)).toBe(0);
            var result = Utils_6.Utils.randomInt(5);
            expect(result >= 0).toBeTruthy();
            expect(result).toBeLessThan(5);
        });
        it('randomInt(), min and max', function () {
            var result = Utils_6.Utils.randomInt(1);
            expect(result).toBe(0);
            result = Utils_6.Utils.randomInt(0, 5);
            expect(result >= 0).toBeTruthy();
            expect(result).toBeLessThan(5);
            result = Utils_6.Utils.randomInt(100, 150);
            expect(result >= 100).toBeTruthy();
            expect(result).toBeLessThan(150);
        });
        it('timestamp()', function () {
            var DELAY = 100;
            var start = Utils_6.Utils.timestamp();
            var waitUntil = Date.now() + DELAY + 1; // Wait > 100 milliseconds
            while (Date.now() < waitUntil) { }
            var end = Utils_6.Utils.timestamp();
            expect(end).toBeGreaterThan(start + DELAY);
        });
        it('initConsole() with console defined', function () {
            var mockConsole = {
                info: 1,
                log: 2,
                warn: 3,
                'error': 4
            };
            var origConsole = window.console;
            window.console = mockConsole;
            Utils_6.Utils.initConsole();
            expect(window.console).toBe(mockConsole);
            window.console = origConsole;
        });
        it('initConsole() with console undefined', function () {
            var origConsole = window.console;
            window.console = null;
            Utils_6.Utils.initConsole();
            expect(window.console).not.toBeNull();
            window.console = origConsole;
        });
    });
});

//# sourceMappingURL=gtp.js.map