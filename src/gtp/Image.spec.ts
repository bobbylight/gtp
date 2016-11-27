import {Image} from '../index';

describe('Image', () => {
	'use strict';

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

});
