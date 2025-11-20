import { Image } from '../index.js';

describe('Image', () => {

	it('constructor happy path - 1 arg', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const image: Image = new Image(canvas);
		expect(image.width).toBe(canvas.width);
		expect(image.height).toBe(canvas.height);
		expect(image.x).toBe(0);
		expect(image.y).toBe(0);
	});

	it('constructor happy path - 5 args', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const image: Image = new Image(canvas, 2, 2, 20, 20);
		expect(image.width).toBe(20);
		expect(image.height).toBe(20);
		expect(image.x).toBe(2);
		expect(image.y).toBe(2);
	});

	describe('createRecoloredCopy', () => {
		it('works', () => {
			// Create a 2x1 canvas with 1 white and 1 black pixel
			const origCanvas = document.createElement('canvas');
			origCanvas.width = 2;
			origCanvas.height = 1;
			const origCtx = origCanvas.getContext('2d');
			if (!origCtx) {
				throw new Error('Could not get context');
			}
			const origPixelData = origCtx.getImageData(0, 0, 2, 1);
			origPixelData.data[0] = 0xff;
			origPixelData.data[1] = 0xff;
			origPixelData.data[2] = 0xff;
			origPixelData.data[3] = 0xff;
			origPixelData.data[4] = 0x00;
			origPixelData.data[5] = 0x00;
			origPixelData.data[6] = 0x00;
			origPixelData.data[7] = 0xff;
			origCtx.putImageData(origPixelData, 0, 0);

			// Create an image from that canvas
			const origImage = new Image(origCanvas);

			// Create a new image from the original with inverted colors.
			// Render it to a new canvas
			const newImage = origImage.createRecoloredCopy({
				fromR: 0xff, fromG: 0xff, fromB: 0xff, toR: 0x00, toG: 0x00, toB: 0x00,
			}, {
				fromR: 0x00, fromG: 0x00, fromB: 0x00, toR: 0xff, toG: 0xff, toB: 0xff,
			});
			const newImageCanvas = document.createElement('canvas');
			newImageCanvas.width = 2;
			newImageCanvas.height = 1;
			const newImageCtx = newImageCanvas.getContext('2d');
			if (!newImageCtx) {
				throw new Error('Could not get context');
			}
			newImage.draw(newImageCtx, 0, 0);

			// Verify the colors are inverted
			const newPixelData = newImageCtx.getImageData(0, 0, 2, 1);
			expect(newPixelData.data[0]).toEqual(0x00);
			expect(newPixelData.data[1]).toEqual(0x00);
			expect(newPixelData.data[2]).toEqual(0x00);
			expect(newPixelData.data[3]).toEqual(0xff);
			expect(newPixelData.data[4]).toEqual(0xff);
			expect(newPixelData.data[5]).toEqual(0xff);
		});
	});
});
