import { Game } from '../index';
import State from './State';

class DummyState extends State<Game> {
}

describe('Game', () => {

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	it('constructor happy path', () => {
		new Game();
	});

	it('clearScreen() works', () => {

		const game: Game = new Game();
		game.clearScreen('#0000ff');

		const ctx: CanvasRenderingContext2D = game.canvas.getContext('2d')!;
		const imageData: ImageData = ctx.getImageData(0, 0, 1, 1);
		const pixels: Uint8ClampedArray = imageData.data;

		for (let i = 0; i < pixels.length; i += 4) {
			expect(pixels[0]).toEqual(0);
			expect(pixels[1]).toEqual(0);
			expect(pixels[2]).toEqual(0xff);
			expect(pixels[3]).toEqual(0xff); // alpha
		}
	});

	it('getHeight() returns the canvas height', () => {

		const game: Game = new Game({
			width: 320,
			height: 240,
		});
		expect(game.getHeight()).toEqual(240);
	});

	it('getHeight() returns the canvas width', () => {

		const game: Game = new Game({
			width: 320,
			height: 240,
		});
		expect(game.getWidth()).toEqual(320);
	});

	it('setting paused state works', () => {

		const game: Game = new Game();

		expect(game.paused).toBeFalsy();
		game.paused = true;
		expect(game.paused).toBeTruthy();
		game.paused = false;
		expect(game.paused).toBeFalsy();
	});

	it('getting playTime works', async() => {

		const game: Game = new Game();

		const firstPlayTime = game.playTime;
		await new Promise(r => setTimeout(r, 50));
		expect(game.playTime).toBeGreaterThan(firstPlayTime);
	});

	it('resetting playTime works', async() => {

		const game: Game = new Game();

		await new Promise(r => setTimeout(r, 50));
		const firstPlayTime = game.playTime;
		game.resetPlayTime();
		expect(game.playTime).toBeLessThan(firstPlayTime);
	});

	it('randomInt() works', () => {
		const game: Game = new Game();
		expect(game.randomInt(10)).toBeLessThan(10);
	});

	it('render works without error', () => {

		const game: Game = new Game({
			width: 320,
			height: 240,
		});
		game.toggleShowFps();

		game.setState(new DummyState());

		game.render();
	});

	it('start() starts an event loop', async() => {

		const game: Game = new Game();
		game.setState(new DummyState());
		game.start();
		game.toggleShowFps();

		const updateSpy: jest.SpyInstance = jest.spyOn(game, 'update');
		const renderSpy: jest.SpyInstance = jest.spyOn(game, 'render');

		await new Promise(r => setTimeout(r, 50));
		expect(updateSpy).toHaveBeenCalled();
		expect(renderSpy).toHaveBeenCalled();
	});


	it('toggleMuted() toggles mute state', () => {
		const game: Game = new Game();
		expect(game.toggleMuted()).toBeTruthy();
		expect(game.toggleMuted()).toBeFalsy();
	});
});
