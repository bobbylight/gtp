import { TiledObject } from '../index';

describe('TiledObject', () => {

	let object: TiledObject;

	beforeEach(() => {

		(window as any).game = {
			scale: 1
		};

		object = new TiledObject({
			x: 0,
			y: 0,
			width: 5,
			height: 5
		});
	});

	it('intersects() returns success when top-left corner shared and completely contained', () => {
		expect(object.intersects(0, 0, 1, 1)).toBeTruthy();
	});

	it('intersects() returns success when exact match checked', () => {
		expect(object.intersects(0, 0, 5, 5)).toBeTruthy();
	});

	it('intersects() returns success when other rect completely contained', () => {
		expect(object.intersects(1, 1, 1, 1)).toBeTruthy();
	});

	it('intersects() returns success when top-left corner contained', () => {
		expect(object.intersects(3, 3, 5, 5)).toBeTruthy();
	});

	it('intersects() returns success when bottom-right corner contained', () => {
		expect(object.intersects(-2, -2, 3, 3)).toBeTruthy();
	});

	it('intersects() returns false if other rect is outside', () => {
		expect(object.intersects(5, 5, 1, 1)).toBeFalsy();
	});

	it('intersects() returns false if width === 0', () => {
		object.width = 0;
		expect(object.intersects(1, 1, 1, 1)).toBeFalsy();
	});

	it('intersects() returns false if width < 0', () => {
		object.width = -1;
		expect(object.intersects(1, 1, 1, 1)).toBeFalsy();
	});

	it('intersects() returns false if height === 0', () => {
		object.height = 0;
		expect(object.intersects(1, 1, 1, 1)).toBeFalsy();
	});

	it('intersects() returns false if height < 0', () => {
		object.height = -1;
		expect(object.intersects(1, 1, 1, 1)).toBeFalsy();
	});

	it('intersects() returns false if other width === 0', () => {
		expect(object.intersects(1, 1, 0, 1)).toBeFalsy();
	});

	it('intersects() returns false if other width < 0', () => {
		expect(object.intersects(1, 1, -1, 1)).toBeFalsy();
	});

	it('intersects() returns false if other height === 0', () => {
		expect(object.intersects(1, 1, 1, 0)).toBeFalsy();
	});

	it('intersects() returns false if other height < 0', () => {
		expect(object.intersects(1, 1, 1, -1)).toBeFalsy();
	});
});
