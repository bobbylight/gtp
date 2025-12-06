import { beforeEach } from 'vitest';
import { BitmapFont, Image } from '../index.js';

describe('BitmapFont', () => {
	let ctx: CanvasRenderingContext2D;

	beforeEach(() => {
		const canvas: HTMLCanvasElement = document.createElement('canvas');
		const temp = canvas.getContext('2d');
		if (!temp) {
			throw new Error('Could not get rendering context for testing');
		}
		ctx = temp;
	});

	afterEach(() => {
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('constructor sets up the instance properly', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 60;
		const image: Image = new Image(canvas);

		const font = new BitmapFont(image, 10, 10, 0, 0, 2);
		expect(font.rowCount).toEqual(3);
		expect(font.colCount).toEqual(2);
		expect(font.size).toEqual(6);
	});

	describe('addVariant()', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 60;
		const image: Image = new Image(canvas);

		it('adds another color of the font to render', () => {
			const font = new BitmapFont(image, 10, 10, 0, 0, 2);
			font.addVariant('test', {
				fromR: 0, fromG: 0, fromB: 0, toR: 255, toG: 255, toB: 255,
			});
			vi.spyOn(font, 'drawByIndex').mockImplementation(() => {});
			expect(() => { font.drawString(ctx, '      ', 0, 0, 'test'); }).not.toThrowError();
		});
	});

	describe('drawString()', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 60;
		const image: Image = new Image(canvas);

		it('renders all printable chars', () => {
			const font = new BitmapFont(image, 10, 10, 0, 0, 2);
			const drawByIndexSpy = vi.spyOn(font, 'drawByIndex');
			font.drawString(ctx, '      ', 0, 0);
			expect(drawByIndexSpy).toHaveBeenCalledTimes(6);
		});

		it('converts unprintable chars to spaces', () => {

			const font = new BitmapFont(image, 10, 10, 0, 0, 2);
			const drawByIndexSpy = vi.spyOn(font, 'drawByIndex');
			font.drawString(ctx, ' \x13 ', 0, 0);

			// All 3 chars rendered are for font index 0
			expect(drawByIndexSpy).toHaveBeenCalledTimes(3);
			for (let i = 0; i < 3; i++) {
				expect(drawByIndexSpy).toHaveBeenNthCalledWith(i + 1,
					expect.anything(), expect.anything(), expect.anything(), 0,
				);
			}
		});

		it('converts printable chars not in the bitmap font to spaces', () => {

			const font = new BitmapFont(image, 10, 10, 0, 0, 2);
			const drawByIndexSpy = vi.spyOn(font, 'drawByIndex');
			font.drawString(ctx, ' \x70 ', 0, 0); // 0x70 > the font size of 6 chars

			// All 3 chars rendered are for font index 0
			expect(drawByIndexSpy).toHaveBeenCalledTimes(3);
			for (let i = 0; i < 3; i++) {
				expect(drawByIndexSpy).toHaveBeenNthCalledWith(i + 1,
					expect.anything(), expect.anything(), expect.anything(), 0,
				);
			}
		});

		it('does not error if an invalid color is specified', () => {
			const font = new BitmapFont(image, 10, 10, 0, 0, 2);
			vi.spyOn(font, 'drawByIndex').mockImplementation(() => {});
			expect(() => { font.drawString(ctx, '      ', 0, 0, 'invalidVariant'); }).not.toThrowError();
		});
	});
});
