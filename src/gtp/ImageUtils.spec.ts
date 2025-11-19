import {ImageUtils} from '../index';

describe('ImageUtils', () => {

	// it('resizing an HTMLImageElement works', (done) => {
	//
	// 	const image: HTMLImageElement = document.createElement('img') as HTMLImageElement;
	// 	image.width = 10;
	// 	image.height = 10;
	//
	// 	image.onload = () => {
	// 		const canvas: HTMLCanvasElement = ImageUtils.resize(image, 2);
	// 		expect(canvas.width).toEqual(20);
	// 		expect(canvas.height).toEqual(20);
	// 		done();
	// 	};
	// 	image.onerror = (e) => {
	// 		done(`Error loading image data: ${e}`);
	// 	};
	//
	// 	image.src = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEVBMTczNDg3QzA5MTFFNjk3ODM5NjQyRjE2RjA3QTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEVBMTczNDk3QzA5MTFFNjk3ODM5NjQyRjE2RjA3QTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowRUExNzM0NjdDMDkxMUU2OTc4Mzk2NDJGMTZGMDdBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowRUExNzM0NzdDMDkxMUU2OTc4Mzk2NDJGMTZGMDdBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjjUmssAAAGASURBVHjatJaxTsMwEIbpIzDA6FaMMPYJkDKzVYU+QFeEGPIKfYU8AETkCYI6wANkZQwIKRNDB1hA0Jrf0rk6WXZ8BvWkb4kv99vn89kDrfVexBSYgVNwDA7AN+jAK3gEd+AlGMGIBFDgFvzouK3JV/lihQTOwLtOtw9wIRG5pJn91Tbgqk9kSk7GViADrTD4HCyZ0NQnomi51sb0fUyCMQEbp2WpU67IjfNjwcYyoUDhjJVcZBjYBy40j4wXgaobWoe8Z6Y80CJBwFpunepIzt2AUgFjtXXshNXjVmMh+K+zzp/CMs0CqeuzrxSRpbOKfdCkiMTS1VBQ41uxMyQR2qbrXiiwYN3ACh1FDmsdK2Eu4J6Tlo31dYVtCY88h5ELZIJJ+IRMzBHfyJINrigNkt5VsRiub9nXICdsYyVd2NcVvA3ScE5t2rb5JuEeyZnAhmLt9NK63vX1O5Pe8XaPSuGq1uTrfUgMEp9EJ+CQvr+BJ/AAKvAcCiAR+bf9CjAAluzmdX4AEIIAAAAASUVORK5CYII=';
	// });

	it('resizing an HTMLCanvasElement works', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 10;
		canvas.height = 10;

		const resized: HTMLCanvasElement = ImageUtils.resize(canvas, 2);
		expect(resized.width).toEqual(20);
		expect(resized.height).toEqual(20);
	});

	it('resizing but param set to 1x works', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 10;
		canvas.height = 10;

		const resized: HTMLCanvasElement = ImageUtils.resize(canvas, 1);
		expect(resized.width).toEqual(10);
		expect(resized.height).toEqual(10);
	});

	it('ensuring a canvas is 256x256 will resize if smaller', () => {

		const sizes: number[] = [ 1, 64, 255 ];

		for (const size of sizes) {

			const canvas: HTMLCanvasElement = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;

			const resized: HTMLCanvasElement = ImageUtils.ensure256Square(canvas);
			expect(resized.width).toEqual(256);
			expect(resized.height).toEqual(256);
		}
	});

	it('ensuring a canvas with width < 256 can get resized to 256', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 256;

		const resized: HTMLCanvasElement = ImageUtils.ensure256Square(canvas);
		expect(resized.width).toEqual(256);
		expect(resized.height).toEqual(256);
	});

	it('ensuring a canvas with height < 256 can get resized to 256', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 128;

		const resized: HTMLCanvasElement = ImageUtils.ensure256Square(canvas);
		expect(resized.width).toEqual(256);
		expect(resized.height).toEqual(256);
	});

	it('ensuring a canvas >= 256 square is at least 256x256 keeps its size', () => {

		const sizes: number[] = [ 256, 257, 512 ];

		for (const size of sizes) {

			const canvas: HTMLCanvasElement = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;

			const resized: HTMLCanvasElement = ImageUtils.ensure256Square(canvas);
			expect(resized.width).toEqual(size);
			expect(resized.height).toEqual(size);
		}
	});

	it('makeColorTranslucent() should work', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 128;

		const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		let pixels: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		expect(pixels.data[(canvas.height * canvas.width - 1) * 4]).toEqual(0xff);
		expect(pixels.data[(canvas.height * canvas.width - 1) * 4 + 1]).toEqual(0xff);
		expect(pixels.data[(canvas.height * canvas.width - 1) * 4 + 2]).toEqual(0xff);
		expect(pixels.data[(canvas.height * canvas.width - 1) * 4 + 3]).toEqual(0xff);

		ImageUtils.makeColorTranslucent(canvas, 0, 0);

		pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
		expect(pixels.data[(canvas.height * canvas.width - 1) * 4]).toEqual(0);
		expect(pixels.data[(canvas.height * canvas.width - 1) * 4 + 1]).toEqual(0);
		expect(pixels.data[(canvas.height * canvas.width - 1) * 4 + 2]).toEqual(0);
		expect(pixels.data[(canvas.height * canvas.width - 1) * 4 + 3]).toEqual(0);

	});
});
