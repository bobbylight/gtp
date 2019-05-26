import Image from './Image';
import ImageUtils from './ImageUtils';

/**
 * Information about a single image in an image atlas.  One of the following sets of optional
 * parameters must be specified:
 *
 * <ul>
 *     <li><code>x, y, w, h</code></li>
 *     <li><code>x, y, s</code>, where <code>s</code> is both the width and height</li>
 *     <li><code>dim</code>, which is a string of the form <code>"x, y, w, h"</code></li>
 * </ul>
 */
export interface ImageInfo {
	id: string;
	dim?: string;
	x?: number;
	y?: number;
	s?: number;
	w?: number;
	h?: number;
}

/**
 * Information about all images in an image atlas.
 */
export interface ImageAtlasInfo {

	/**
	 * The set of images to parse out of the atlas.
	 */
	images: ImageInfo[];

	/**
	 * Whether the pixel color at (0, 0) should be treated as translucent.  Defaults to <code>false</code>.
	 */
	firstPixelIsTranslucent?: boolean;

	/**
	 * Whether to prefix the IDs of the images in <code>images</code> with some prefix.  Use this if you cannot
	 * control the IDs of the image atlas and need, or just want, the namespacing.  Specifying a value of
	 * <code>true</code> will use <code>"&lt;id-of-atlas&gt;."</code> as the prefix.  Specifying a string value will
	 * use that as the prefix.
	 */
	prefix?: string | boolean;
}

/**
 * A mapping from ID to image of all images parsed out of the image atlas.
 */
export interface ImageMap {
	[ id: string ]: Image;
}

/**
 * Parses images out of an image atlas.
 */
export default class ImageAtlas {

	private readonly atlasInfo: any;
	private readonly masterCanvas: HTMLCanvasElement;

	/**
	 * Provides a means of parsing images out of an image atlas.
	 *
	 * @param canvas The canvas containing the image atlas's image.
	 * @param atlasInfo Information on how to parse the individual images out
	 *        of the atlas.
	 */
	constructor(canvas: HTMLCanvasElement, atlasInfo: ImageAtlasInfo) {
		this.atlasInfo = atlasInfo;
		this.masterCanvas = canvas;
		if (this.atlasInfo.firstPixelIsTranslucent) {
			this.masterCanvas = ImageUtils.makeColorTranslucent(this.masterCanvas);
		}
	}

	/**
	 * Parses all images out of the atlas.
	 *
	 * @param [scale=1] If gtpImage was scaled up, this is the scale factor.
	 *        The cell width, height, and spacing values will be multiplied
	 *        by this value.
	 * @returns The parsed images.
	 */
	// tslint:disable:no-magic-numbers
	parse(scale: number = 1): ImageMap {

		const images: ImageMap = {};

		this.atlasInfo.images.forEach((imgInfo: ImageInfo) => {

			const id: string = imgInfo.id;
			let x: number,
				y: number,
				w: number,
				h: number;

			if (imgInfo.dim) {
				const dim: string[] = imgInfo.dim.split(/,\s*/);
				if (dim.length !== 4) {
					throw new Error(`Invalid value for imgInfo ${id}'s dim: ${imgInfo.dim}`);
				}
				x = parseInt(dim[0], 10);
				y = parseInt(dim[1], 10);
				w = parseInt(dim[2], 10);
				h = parseInt(dim[3], 10);
			}
			else {
				x = typeof imgInfo.x === 'number' ? imgInfo.x : -1;
				y = typeof imgInfo.y === 'number' ? imgInfo.y : -1;
				if (typeof imgInfo.s === 'number') {
					w = h = imgInfo.s;
				}
				else {
					w = typeof imgInfo.w === 'number' ? imgInfo.w : -1;
					h = typeof imgInfo.h === 'number' ? imgInfo.h : -1;
				}
				if (x < 0 || y < 0 || w < 0 || h < 0) {
					throw new Error(`x, y, w, h (or s) not specified for imgInfo: ${JSON.stringify(imgInfo)}`);
				}
			}

			if (scale !== 1) {
				x *= scale;
				y *= scale;
				w *= scale;
				h *= scale;
			}

			images[id] = new Image(this.masterCanvas, x, y, w, h);
		});

		return images;
	}
	// tslint:enable:no-magic-numbers
}
