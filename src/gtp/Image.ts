module gtp {
	'use strict';

	export class Image {

		private _canvas: HTMLCanvasElement;
		x: number;
		y: number;
		private _width: number;
		private _height: number;

		/**
		 * A wrapper around images.  Handles browser-specific quirks and other things
		 * a game shouldn't have to know about.
		 *
		 * @constructor
		 */
		constructor(canvas: HTMLCanvasElement, x?: number, y?: number, w?: number, h?: number) {
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
		_ensure256Square() {
			if (this._canvas.width < 256 || this._canvas.height < 256) {
				var w: number = Math.max(256, this._canvas.width);
				var h: number = Math.max(256, this._canvas.height);
				var canvas2: HTMLCanvasElement = gtp.ImageUtils.createCanvas(w, h);
				var ctx2: CanvasRenderingContext2D = canvas2.getContext('2d');
				ctx2.drawImage(this._canvas, 0, 0);
				this._canvas = canvas2;
			}
		}
   
		/**
		 * Draws this image.
		 * 
		 * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
		 * @param {int} x The x-coordinate at which to draw.
		 * @param {int} y The y-coordinate at which to draw.
		 */
		draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
			ctx.drawImage(this._canvas, this.x, this.y, this._width, this._height,
				x, y, this._width, this._height);
		}
   
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
		drawScaled(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
			ctx.drawImage(this._canvas, this.x, this.y, this._width, this._height,
				x, y, w, h);
		}
   
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
		drawScaled2(ctx: CanvasRenderingContext2D, srcX: number, srcY: number, srcW: number, srcH: number,
			destX: number, destY: number, destW: number, destH: number) {
			srcX = this.x + srcX;
			srcY = this.y + srcY;
			ctx.drawImage(this._canvas, srcX, srcY, srcW, srcH,
				destX, destY, destW, destH);
		}
   
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
		makeColorTranslucent(x: number = 0, y: number = 0) {
			gtp.ImageUtils.makeColorTranslucent(this._canvas, x, y);
		}
   
		get width(): number {
			return this._width;
		}
   
		get height(): number {
			return this._height;
		}

	}
}