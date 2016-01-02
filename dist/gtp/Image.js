var gtp;
(function (gtp) {
    'use strict';
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
                var canvas2 = gtp.ImageUtils.createCanvas(w, h);
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
            if (!gtp.ImageUtils.allowSubpixelImageRendering) {
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
            if (!gtp.ImageUtils.allowSubpixelImageRendering) {
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
            if (!gtp.ImageUtils.allowSubpixelImageRendering) {
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
            gtp.ImageUtils.makeColorTranslucent(this._canvas, x, y);
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
    })();
    gtp.Image = Image;
})(gtp || (gtp = {}));

//# sourceMappingURL=Image.js.map
