import ImageUtils from './ImageUtils';

/**
 * A wrapper around images.  Handles browser-specific quirks and other things a game shouldn't have
 * to know about.
 */
export default class Image {

	private readonly canvas: HTMLCanvasElement;
	x: number;
	y: number;
	private readonly w: number;
	private readonly h: number;

	/**
	 * A wrapper around images.  Handles browser-specific quirks and other things
	 * a game shouldn't have to know about.
	 */
	constructor(canvas: HTMLCanvasElement, x?: number, y?: number, w?: number, h?: number) {
		if (x !== undefined && y !== undefined && w !== undefined && h !== undefined) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
		}
		else {
			this.x = this.y = 0;
			// Set these with regard to original canvas, not (possibly) resized one
			this.w = canvas.width;
			this.h = canvas.height;
		}
		this.canvas = ImageUtils.ensure256Square(canvas);
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
		ctx.drawImage(this.canvas, this.x, this.y, this.w, this.h,
			x, y, this.w, this.h);
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
		ctx.drawImage(this.canvas, this.x, this.y, this.w, this.h,
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

		ctx.drawImage(this.canvas, srcX, srcY, srcW, srcH,
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
		ImageUtils.makeColorTranslucent(this.canvas, x, y);
	}

	get width(): number {
		return this.w;
	}

	get height(): number {
		return this.h;
	}

}
