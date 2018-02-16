import ImageUtils from './ImageUtils';

const MIN_CANVAS_DIMENSION: number = 256;

/**
 * A wrapper around images.  Handles browser-specific quirks and other things a game shouldn't have
 * to know about.
 */
export default class Image {

	private _canvas: HTMLCanvasElement;
	x: number;
	y: number;
	private readonly _width: number;
	private readonly _height: number;

	/**
	 * A wrapper around images.  Handles browser-specific quirks and other things
	 * a game shouldn't have to know about.
	 */
	constructor(canvas: HTMLCanvasElement, x?: number, y?: number, w?: number, h?: number) {
		this._canvas = canvas;
		if (x !== undefined && y !== undefined && w !== undefined && h !== undefined) {
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
		if (this._canvas.width < MIN_CANVAS_DIMENSION || this._canvas.height < MIN_CANVAS_DIMENSION) {
			const w: number = Math.max(MIN_CANVAS_DIMENSION, this._canvas.width);
			const h: number = Math.max(MIN_CANVAS_DIMENSION, this._canvas.height);
			const canvas2: HTMLCanvasElement = ImageUtils.createCanvas(w, h);
			const ctx2: CanvasRenderingContext2D = canvas2.getContext('2d')!;
			ctx2.drawImage(this._canvas, 0, 0);
			this._canvas = canvas2;
		}
	}

	/**
	 * Draws this image.
	 *
	 * @param ctx A canvas' graphics context.
	 * @param x The x-coordinate at which to draw.
	 * @param y The y-coordinate at which to draw.
	 */
	draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
		if (!ImageUtils.allowSubpixelImageRendering) {
			x = Math.round(x);
			y = Math.round(y);
		}
		ctx.drawImage(this._canvas, this.x, this.y, this._width, this._height,
			x, y, this._width, this._height);
	}

	/**
	 * Draws this image.
	 *
	 * @param ctx A canvas' graphics context.
	 * @param x The x-coordinate at which to draw.
	 * @param y The y-coordinate at which to draw.
	 * @param w The width to (possibly) stretch the image to when
	 *              drawing.
	 * @param h The height to (possibly) stretch the image to when
	 *              drawing.
	 */
	drawScaled(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
		if (!ImageUtils.allowSubpixelImageRendering) {
			x = Math.round(x);
			y = Math.round(y);
		}
		ctx.drawImage(this._canvas, this.x, this.y, this._width, this._height,
			x, y, w, h);
	}

	/**
	 * Draws this image.
	 *
	 * @param ctx A canvas' graphics context.
	 * @param srcX The x-coordinate at which to draw.
	 * @param srcY The y-coordinate at which to draw.
	 * @param srcW The width of the (possibly) sub-image to draw.
	 * @param srcH The height of the (possibly) sub-image to draw.
	 * @param destX The x-coordinate at which to draw.
	 * @param destY The y-coordinate at which to draw.
	 * @param destW The width to (possibly) stretch the image to when
	 *              drawing.
	 * @param destH The height to (possibly) stretch the image to when
	 *              drawing.
	 */
	drawScaled2(ctx: CanvasRenderingContext2D, srcX: number, srcY: number,
			srcW: number, srcH: number,
			destX: number, destY: number, destW: number, destH: number) {

		if (!ImageUtils.allowSubpixelImageRendering) {
			srcX = Math.round(srcX);
			srcY = Math.round(srcY);
			destX = Math.round(destX);
			destY = Math.round(destY);
		}
		srcX = this.x + srcX;
		srcY = this.y + srcY;

		ctx.drawImage(this._canvas, srcX, srcY, srcW, srcH,
			destX, destY, destW, destH);
	}

	/**
	 * Converts a color of a particular type to completely transparent in this
	 * image.
	 *
	 * @param x The x-coordinate of the pixel whose color to change.  0 will
	 *        be used if this parameter is undefined.
	 * @param y The y-coordinate of the pixel whose color to change.  0 will
	 *        be used if this parameter is undefined.
	 * @return This image, which has been modified.
	 */
	makeColorTranslucent(x: number = 0, y: number = 0) {
		ImageUtils.makeColorTranslucent(this._canvas, x, y);
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

}
