import TiledObject, { intersects, scaleObject } from './TiledObject';

describe('TiledObject', () => {

	let object: TiledObject;

	beforeEach(() => {

		object = {
			x: 0,
			y: 0,
			width: 5,
			height: 5,
		} as TiledObject;
	});

	describe('scaleObject()', () => {

		it('scales the object appropriately', () => {
			scaleObject(object, 3);
			expect(object.x).toBe(0);
			expect(object.y).toBe(0);
			expect(object.width).toBe(15);
			expect(object.height).toBe(15);
		});
	});

	describe('intersects()', () => {

		it('returns success when top-left corner shared and completely contained', () => {
			expect(intersects(object, 0, 0, 1, 1)).toBeTruthy();
		});

		it('returns success when exact match checked', () => {
			expect(intersects(object, 0, 0, 5, 5)).toBeTruthy();
		});

		it('returns success when other rect completely contained', () => {
			expect(intersects(object, 1, 1, 1, 1)).toBeTruthy();
		});

		it('returns success when top-left corner contained', () => {
			expect(intersects(object, 3, 3, 5, 5)).toBeTruthy();
		});

		it('returns success when bottom-right corner contained', () => {
			expect(intersects(object, -2, -2, 3, 3)).toBeTruthy();
		});

		it('returns false if other rect is outside', () => {
			expect(intersects(object, 5, 5, 1, 1)).toBeFalsy();
		});

		it('returns false if width === 0', () => {
			object.width = 0;
			expect(intersects(object, 1, 1, 1, 1)).toBeFalsy();
		});

		it('returns false if width < 0', () => {
			object.width = -1;
			expect(intersects(object, 1, 1, 1, 1)).toBeFalsy();
		});

		it('returns false if height === 0', () => {
			object.height = 0;
			expect(intersects(object, 1, 1, 1, 1)).toBeFalsy();
		});

		it('returns false if height < 0', () => {
			object.height = -1;
			expect(intersects(object, 1, 1, 1, 1)).toBeFalsy();
		});

		it('returns false if other width === 0', () => {
			expect(intersects(object, 1, 1, 0, 1)).toBeFalsy();
		});

		it('returns false if other width < 0', () => {
			expect(intersects(object, 1, 1, -1, 1)).toBeFalsy();
		});

		it('returns false if other height === 0', () => {
			expect(intersects(object, 1, 1, 1, 0)).toBeFalsy();
		});

		it('returns false if other height < 0', () => {
			expect(intersects(object, 1, 1, 1, -1)).toBeFalsy();
		});
	});
});
