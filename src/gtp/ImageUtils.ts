import Utils from './Utils.js';

const MIN_CANVAS_DIMENSION= 256;

/**
 * General-purpose utilities for manipulating images in canvases.
 */
export default class ImageUtils {

	/**
	 * If <code>true</code>, subpixel rendering is allowed; otherwise, x- and
	 * y-coordinates are rounded to the nearest integer when rendering images.
	 */
	static allowSubpixelImageRendering= false;

	/**
	 * Takes an img/canvas and a scaling factor and returns the scaled image.
	 */
	static resize(img: HTMLImageElement|HTMLCanvasElement, scale= 1): HTMLCanvasElement {

		// The original image is drawn into an offscreen canvas of the same size
		// and copied, pixel by pixel into another offscreen canvas with the
		// new size.

		let orig: HTMLCanvasElement,
			origCtx: CanvasRenderingContext2D;

		if (img instanceof HTMLImageElement) {
			orig = ImageUtils.createCanvas(img.width, img.height);
			origCtx = Utils.getRenderingContext(orig);
			origCtx.drawImage(img, 0, 0);
		} else {
			orig = img;
			origCtx = Utils.getRenderingContext(orig);
		}

		if (scale === 1) {
			return orig; // No reason to scale
		}

		const origPixels: ImageData = origCtx.getImageData(0, 0, img.width, img.height);

		const widthScaled: number = img.width * scale;
		const heightScaled: number = img.height * scale;
		const scaled: HTMLCanvasElement = ImageUtils.createCanvas(widthScaled, heightScaled);
		const scaledCtx: CanvasRenderingContext2D = Utils.getRenderingContext(scaled);
		const scaledPixels: ImageData = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);

		for (let y= 0; y < heightScaled; y++) {
			for (let x= 0; x < widthScaled; x++) {
				const index: number = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
				const indexScaled: number = (y * widthScaled + x) * 4;
				scaledPixels.data[indexScaled] = origPixels.data[index];
				scaledPixels.data[indexScaled + 1] = origPixels.data[index + 1];
				scaledPixels.data[indexScaled + 2] = origPixels.data[index + 2];
				scaledPixels.data[indexScaled + 3] = origPixels.data[index + 3];
			}
		}

		scaledCtx.putImageData(scaledPixels, 0, 0);
		return scaled;
	}

	static createCanvas(width: number, height: number, parentDiv?: HTMLElement | string) {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		ImageUtils.prepCanvas(canvas);

		if (parentDiv) {

			const actualParent = typeof parentDiv === 'string' ?
				document.getElementById(parentDiv) : parentDiv;
			if (!actualParent) {
				throw new Error('Cannot find parent div');
			}

			// Clear previous contents in place there was a placeholder image
			actualParent.innerHTML = '';
			actualParent.appendChild(canvas);
		}

		return canvas;
	}

	/**
	 * Chrome has trouble copying from a canvas in RAM to a canvas in GPU memory
	 * and vice versa, unless all canvases are >= 256x256.
	 */
	static ensure256Square(canvas: HTMLCanvasElement): HTMLCanvasElement {

		if (canvas.width < MIN_CANVAS_DIMENSION || canvas.height < MIN_CANVAS_DIMENSION) {
			const w: number = Math.max(MIN_CANVAS_DIMENSION, canvas.width);
			const h: number = Math.max(MIN_CANVAS_DIMENSION, canvas.height);
			const canvas2: HTMLCanvasElement = ImageUtils.createCanvas(w, h);
			const ctx2: CanvasRenderingContext2D = Utils.getRenderingContext(canvas2);
			ctx2.drawImage(canvas, 0, 0);
			canvas = canvas2;
		}

		return canvas;
	}

	static prepCanvas(canvas: HTMLCanvasElement) {
		// Use "any" instead of "CanvasRenderingContext2D" since  the TypeScript definition
		// files don't like the experimental *imageSmoothingEnabled properties
		const ctx: CanvasRenderingContext2D = Utils.getRenderingContext(canvas);
		ctx.imageSmoothingEnabled = false;
		(ctx as any).mozImageSmoothingEnabled = false;
		(ctx as any).oImageSmoothingEnabled = false;
		(ctx as any).webkitImageSmoothingEnabled = false;
		(ctx as any).msImageSmoothingEnabled = false;

		/* TODO: set imageRendering CSS properties based on some Game config property */
	}

	/**
	 * Converts a color of a particular type to completely transparent in a canvas.
	 *
	 * @param canvas The canvas to operate on.
	 * @param x The x-coordinate of the pixel whose color to change.  0 will
	 *        be used if this parameter is undefined.
	 * @param y The y-coordinate of the pixel whose color to change.  0 will
	 *        be used if this parameter is undefined.
	 * @return The original canvas, which has been modified.
	 */
	static makeColorTranslucent(canvas: HTMLCanvasElement, x= 0, y= 0) {

		const ctx = Utils.getRenderingContext(canvas);
		const w: number = canvas.width;
		const h: number = canvas.height;
		const pixels: ImageData = ctx.getImageData(0, 0, w, h);

		const color: number[] = [];
		const offs: number = (y * w + x) * 4;
		for (let i= 0; i < 4; i++) {
			color[i] = pixels.data[offs + i];
		}

		for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
				const index: number = (y * w + x) * 4;
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
	}
}
