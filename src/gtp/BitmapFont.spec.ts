import { BitmapFont, Game, Image } from '../index';
import { Window } from './GtpBase';

describe('BitmapFont', () => {

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

	describe('drawString()', () => {


		const gameWindow: Window = window as any;
		gameWindow.game = new Game();

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 60;
		const image: Image = new Image(canvas);

		it('renders all printable chars', () => {
			const font = new BitmapFont(image, 10, 10, 0, 0, 2);
			font.drawByIndex = jest.fn(font.drawByIndex);
			font.drawString('      ', 0, 0);
			expect(font.drawByIndex).toHaveBeenCalledTimes(6);
		});

		it('converts unprintable chars to spaces', () => {

			const font = new BitmapFont(image, 10, 10, 0, 0, 2);
			font.drawByIndex = jest.fn(font.drawByIndex);
			font.drawString(' \x13 ', 0, 0);

			// All 3 chars rendered are for font index 0
			expect(font.drawByIndex).toHaveBeenCalledTimes(3);
			for (let i = 0; i < 3; i++) {
				expect(font.drawByIndex).toHaveBeenNthCalledWith(i + 1,
					expect.anything(), expect.anything(), expect.anything(), 0
				);
			}
		});

		it('converts printable chars not in the bitmap font to spaces', () => {

			const font = new BitmapFont(image, 10, 10, 0, 0, 2);
			font.drawByIndex = jest.fn(font.drawByIndex);
			font.drawString(' \x70 ', 0, 0); // 0x70 > the font size of 6 chars

			// All 3 chars rendered are for font index 0
			expect(font.drawByIndex).toHaveBeenCalledTimes(3);
			for (let i = 0; i < 3; i++) {
				expect(font.drawByIndex).toHaveBeenNthCalledWith(i + 1,
					expect.anything(), expect.anything(), expect.anything(), 0
				);
			}
		});
	});
});
