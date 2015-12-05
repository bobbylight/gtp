module gtp {
	'use strict';

	export class ImageAtlas {

		private _atlasInfo: any;
		private _masterCanvas: HTMLCanvasElement;

		constructor(args: any) {
			this._atlasInfo = args.atlasInfo;
			this._masterCanvas = args.canvas;
			if (this._atlasInfo.firstPixelIsTranslucent) {
				this._masterCanvas = gtp.ImageUtils.makeColorTranslucent(this._masterCanvas);
			}
		}

		parse() {

			var images: { [id: string]: gtp.Image } = {};
			var self = this;

			this._atlasInfo.images.forEach(function(imgInfo: any) {

				var id: string = imgInfo.id;
				var dim: any;
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

				dim = dim.map(function(str: string) {
					return parseInt(str, 10) * 2;
				});

				images[id] = new gtp.Image(self._masterCanvas, dim[0], dim[1], dim[2], dim[3]);
			});

			return images;
		}
	}
}