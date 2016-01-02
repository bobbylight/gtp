declare module gtp {
    /**
     * General-purpose utilities for manipulating images in canvases.
     * @constructor
     */
    class ImageUtils {
        /**
         * If <code>true</code>, subpixel rendering is allowed; otherwise, x- and
         * y-coordinates are rounded to the nearest integer when rendering images.
         */
        static allowSubpixelImageRendering: boolean;
        /**
         * Takes an img/canvas and a scaling factor and returns the scaled image.
         * @method
         */
        static resize(img: HTMLImageElement | HTMLCanvasElement, scale?: number): HTMLCanvasElement;
        static createCanvas(width: number, height: number, parentDiv?: HTMLElement | string): HTMLCanvasElement;
        static prepCanvas(canvas: HTMLCanvasElement): void;
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
        static makeColorTranslucent(canvas: HTMLCanvasElement, x?: number, y?: number): HTMLCanvasElement;
    }
}
