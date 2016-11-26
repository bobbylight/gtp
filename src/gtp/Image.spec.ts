import {Image} from './Image';

describe('Image', () => {
	'use strict';

	it('constructor happy path - 1 arg', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const image: Image = new Image(canvas);
		expect(image.width).toEqual(canvas.width);
		expect(image.height).toEqual(canvas.height);
		expect(image.x).toEqual(0);
		expect(image.y).toEqual(0);
	});

	it('constructor happy path - 5 args', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const image: Image = new Image(canvas, 2, 2, 20, 20);
		expect(image.width).toEqual(20);
		expect(image.height).toEqual(20);
		expect(image.x).toEqual(2);
		expect(image.y).toEqual(2);
	});

});
