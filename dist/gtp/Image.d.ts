declare module gtp {
    class Image {
        private _canvas;
        x: number;
        y: number;
        private _width;
        private _height;
        /**
         * A wrapper around images.  Handles browser-specific quirks and other things
         * a game shouldn't have to know about.
         *
         * @constructor
         */
        constructor(canvas: HTMLCanvasElement, x?: number, y?: number, w?: number, h?: number);
        /**
         * Chrome has trouble copying from a canvas in RAM to a canvas in GPU memory
         * and vice versa, unless all canvases are >= 256x256.
         */
        _ensure256Square(): void;
        /**
         * Draws this image.
         *
         * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         */
        draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
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
        drawScaled(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
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
        drawScaled2(ctx: CanvasRenderingContext2D, srcX: number, srcY: number, srcW: number, srcH: number, destX: number, destY: number, destW: number, destH: number): void;
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
        makeColorTranslucent(x?: number, y?: number): void;
        readonly width: number;
        readonly height: number;
    }
}
