import { CanvasResizer, StretchMode } from '../index.js';

describe('CanvasResizer', () => {

	it('resize() with STRETCH_NONE works', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		expect(canvas.style.width).not.toEqual('40px');
		expect(canvas.style.height).not.toEqual('50px');

		CanvasResizer.resize(canvas, StretchMode.STRETCH_NONE);
		expect(canvas.style.width).toEqual('40px');
		expect(canvas.style.height).toEqual('50px');
	});

	it.todo('resize() with STRETCH_FILL works', () => {
		// TODO: Implement me once we switch from jsdom to a headless browser setup
	});

	it.todo('resize() with STRETCH_PROPORTIONAL works', () => {
		// TODO: Implement me once we switch from jsdom to a headless browser setup
	});
});
