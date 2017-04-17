/**
 * General-purpose utilities for manipulating images in canvases.
 * @constructor
 */
export default class ImageUtils {

	/**
	 * If <code>true</code>, subpixel rendering is allowed; otherwise, x- and
	 * y-coordinates are rounded to the nearest integer when rendering images.
	 */
	static allowSubpixelImageRendering: boolean = false;

	/**
	 * Takes an img/canvas and a scaling factor and returns the scaled image.
	 * @method
	 */
	static resize(img: HTMLImageElement|HTMLCanvasElement, scale: number = 1): HTMLCanvasElement {

		// The original image is drawn into an offscreen canvas of the same size
		// and copied, pixel by pixel into another offscreen canvas with the
		// new size.

		let orig: HTMLCanvasElement,
			origCtx: CanvasRenderingContext2D;

		if (img instanceof HTMLImageElement) {
			orig = ImageUtils.createCanvas(img.width, img.height);
			origCtx = orig.getContext('2d')!;
			origCtx.drawImage(img, 0, 0);
		}
		else {
			orig = <HTMLCanvasElement>img;
			origCtx = orig.getContext('2d')!;
		}

		if (scale === 1) {
			return orig; // No reason to scale
		}

		const origPixels: ImageData = origCtx.getImageData(0, 0, img.width, img.height);

		const widthScaled: number = img.width * scale;
		const heightScaled: number = img.height * scale;
		const scaled: HTMLCanvasElement = ImageUtils.createCanvas(widthScaled, heightScaled);
		const scaledCtx: CanvasRenderingContext2D = scaled.getContext('2d')!;
		const scaledPixels: ImageData = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);

		for (let y: number = 0; y < heightScaled; y++) {
			for (let x: number = 0; x < widthScaled; x++) {
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

	static createCanvas(width: number, height: number, parentDiv?: HTMLElement|string) {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		ImageUtils.prepCanvas(canvas);

		if (parentDiv) {

			let actualParent: HTMLElement;
			if (typeof parentDiv === 'string') {
				actualParent = document.getElementById(parentDiv)!;
			}
			else {
				actualParent = parentDiv;
			}
			// Clear previous contents in place there was a placeholder image
			actualParent.innerHTML = '';
			actualParent.appendChild(canvas);
		}

		return canvas;
	}

	static prepCanvas(canvas: HTMLCanvasElement) {
		// Use "any" instead of "CanvasRenderingContext2D" since  the TypeScript definition
		// files don't like the experimental *imageSmoothingEnabled properties
		const ctx: any = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.oImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;

		/* TODO: set imageRendering CSS properties based on some Game config property */
	}

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
	static makeColorTranslucent(canvas: HTMLCanvasElement, x: number = 0, y: number = 0) {

		const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
		const w: number = canvas.width;
		const h: number = canvas.height;
		const pixels: ImageData = ctx.getImageData(0, 0, w, h);

		const color: number[] = [];
		const offs: number = (y * w + x) * 4;
		for (let i: number = 0; i < 4; i++) {
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
