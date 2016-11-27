import Image from './Image';
import ImageUtils from './ImageUtils';

export default class ImageAtlas {

	private _atlasInfo: any;
	private _masterCanvas: HTMLCanvasElement;

	constructor(args: any) {
		this._atlasInfo = args.atlasInfo;
		this._masterCanvas = args.canvas;
		if (this._atlasInfo.firstPixelIsTranslucent) {
			this._masterCanvas = ImageUtils.makeColorTranslucent(this._masterCanvas);
		}
	}

	parse() {

		const images: { [id: string]: Image } = {};
		const self: ImageAtlas = this;

		this._atlasInfo.images.forEach((imgInfo: any) => {

			const id: string = imgInfo.id;
			let dim: any;
			if (imgInfo.dim) {
				dim = imgInfo.dim.split(/,\s*/);
				if (dim.length !== 4) {
					throw new Error('Invalid value for imgInfo.dim: ' + imgInfo.dim);
				}
			}
			else {
				dim = [];
				dim.push(imgInfo.x, imgInfo.y, imgInfo.w, imgInfo.h);
			}

			dim = dim.map((str: string) => {
				return parseInt(str, 10) * 2;
			});

			images[id] = new Image(self._masterCanvas, dim[0], dim[1], dim[2], dim[3]);
		});

		return images;
	}
}
