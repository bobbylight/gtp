import { Point } from '../index.js';

describe('Point', () => {

	it('constructor 0-arg', () => {
		const point: Point = new Point();
		expect(point.x).toEqual(0);
		expect(point.y).toEqual(0);
	});

	it('constructor 1-arg', () => {
		const point: Point = new Point(3);
		expect(point.x).toEqual(3);
		expect(point.y).toEqual(0);
	});

	it('constructor 2-arg', () => {
		const point: Point = new Point(3, 4);
		expect(point.x).toEqual(3);
		expect(point.y).toEqual(4);
	});

	it('equals null arg', () => {
		const point: Point = new Point(3, 4);
		expect(point.equals(null)).toBeFalsy();
	});

	it('equals false', () => {
		const point: Point = new Point(3, 4);
		const point2: Point = new Point(3, 5);
		expect(point.equals(point2)).toBeFalsy();
	});

	it('equals true', () => {
		const point: Point = new Point(3, 4);
		const point2: Point = new Point(3, 4);
		expect(point.equals(point2)).toBeTruthy();
		expect(point.equals(point)).toBeTruthy();
	});

});
