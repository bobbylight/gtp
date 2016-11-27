import {Image} from '../index';

describe('Image', () => {
	'use strict';

	it('constructor happy path - 1 arg', () => {

		console.log('aaaaa');
		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		console.log('a');
		const image: Image = new Image(canvas);
		console.log('b');
		expect(image.width).toBe(canvas.width);
		console.log('c');
		expect(image.height).toBe(canvas.height);
		console.log('d');
		expect(image.x).toBe(0);
		console.log('e');
		expect(image.y).toBe(0);
		console.log('f');
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
