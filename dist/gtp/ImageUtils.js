var gtp;
(function (gtp) {
    'use strict';
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
                orig = gtp.ImageUtils.createCanvas(img.width, img.height);
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
            var scaled = gtp.ImageUtils.createCanvas(widthScaled, heightScaled);
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
            gtp.ImageUtils.prepCanvas(canvas);
            if (parentDiv) {
                var actualParent;
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
            /* TODO: set imageRendering CSS properties based on some gtp.Game config property */
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
    gtp.ImageUtils = ImageUtils;
})(gtp || (gtp = {}));

//# sourceMappingURL=ImageUtils.js.map
