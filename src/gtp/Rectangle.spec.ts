import { Rectangle } from '../index';

describe('Rectangle', () => {
	'use strict';

	it('0-arg constructor happy path', () => {
		const rect: Rectangle = new Rectangle();
		expect(rect.x).toEqual(0);
		expect(rect.y).toEqual(0);
		expect(rect.w).toEqual(0);
		expect(rect.h).toEqual(0);
	});

	it('4-arg constructor happy path', () => {
		const rect: Rectangle = new Rectangle(42, 41, 40, 39);
		expect(rect.x).toEqual(42);
		expect(rect.y).toEqual(41);
		expect(rect.w).toEqual(40);
		expect(rect.h).toEqual(39);
	});

	it('containsRect happy path - true', () => {
		const r1: Rectangle = new Rectangle(5, 5, 20, 20);
		const r2: Rectangle = new Rectangle(7, 7, 5, 5);
		expect(r1.containsRect(r2)).toEqual(true);
	});

	it('containsRect happy path - false', () => {
		const r1: Rectangle = new Rectangle(5, 5, 20, 20);
		const r2: Rectangle = new Rectangle(0, 0, 25, 25);
		expect(r1.containsRect(r2)).toEqual(false);
	});

	it('containsRect - identical rectangles', () => {
		const r1: Rectangle = new Rectangle(5, 5, 20, 20);
		const r2: Rectangle = new Rectangle(5, 5, 20, 20);
		expect(r1.containsRect(r2)).toEqual(true);
	});

	it('containsRect - negative width or height', () => {
		let r1: Rectangle = new Rectangle(5, 5, -1, 5);
		let r2: Rectangle = new Rectangle(5, 5, 20, 20);
		expect(r1.containsRect(r2)).toEqual(false);
		expect(r2.containsRect(r1)).toEqual(false);

		r1 = new Rectangle(5, 5, 5, -1);
		r2 = new Rectangle(5, 5, 20, 20);
		expect(r1.containsRect(r2)).toEqual(false);
		expect(r2.containsRect(r1)).toEqual(false);
	});

	it('containsRect - edge case 1 for coverage', () => {
		// w2 === 0, w1 >= x1
		const r1: Rectangle = new Rectangle(5, 5, 10, 5);
		const r2: Rectangle = new Rectangle(5, 5, 0, 20);
		expect(r1.containsRect(r2)).toEqual(false);
	});

	it('containsRect - edge case 2 for coverage', () => {
		// w2 > x2 && w1 >= x1 && w2 > w1
		const r1: Rectangle = new Rectangle(5, 5, 10, 5);
		const r2: Rectangle = new Rectangle(5, 5, 15, 20);
		expect(r1.containsRect(r2)).toEqual(false);
	});

	it('intersects happy path - false', () => {
		const r1: Rectangle = new Rectangle(0, 0, 20, 20);
		const r2: Rectangle = new Rectangle(50, 50, 4, 4);
		expect(r1.intersects(r2)).toEqual(false);
		expect(r2.intersects(r1)).toEqual(false);
	});

	it('intersects - invalid rect, negative width', () => {
		const r1: Rectangle = new Rectangle(20, 20, -4, -4);
		const r2: Rectangle = new Rectangle(50, 50, 4, 4);
		expect(r1.intersects(r2)).toEqual(false);
		expect(r2.intersects(r1)).toEqual(false);
	});

	it('intersects happy path - true', () => {
		const r1: Rectangle = new Rectangle(0, 0, 20, 20);
		const r2: Rectangle = new Rectangle(10, 10, 20, 20);
		expect(r1.intersects(r2)).toEqual(true);
		expect(r2.intersects(r1)).toEqual(true);
	});

	it('intersects, one containing another', () => {
		const r1: Rectangle = new Rectangle(0, 0, 20, 20);
		const r2: Rectangle = new Rectangle(5, 5, 5, 5);
		expect(r1.intersects(r2)).toEqual(true);
		expect(r2.intersects(r1)).toEqual(true);
	});

	it('set', () => {
		const r1: Rectangle = new Rectangle(0, 0, 20, 20);
		r1.set(5, 6, 7, 8);
		expect(r1.x).toBe(5);
		expect(r1.y).toBe(6);
		expect(r1.w).toBe(7);
		expect(r1.h).toBe(8);
	});
});
