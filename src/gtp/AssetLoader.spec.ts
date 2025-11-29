import { AssetLoader, AudioSystem, ImageAtlasInfo, TiledMapData } from '../index.js';
import TiledMap from '../tiled/TiledMap.js';
import { TiledMapArgs } from '../tiled/TiledMapArgs.js';
import { createMockAudioContext } from './TestUtils.js';
import ImageUtils from './ImageUtils.js';

describe('AssetLoader', () => {

	beforeAll(() => {
		vi.stubGlobal('AudioContext', createMockAudioContext());
	});

	afterAll(() => {
		vi.unstubAllGlobals();
	});

	beforeEach(() => {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		const originalCreateElement = document.createElement.bind(document);

		vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: ElementCreationOptions) => {
			// jsdom's implementation of HTMLImageElement doesn't fire the 'load' event when "src" is set.
			// This mock simulates that behavior so behavior matches what occurs in a browser. Note that since
			// we're not returning a true HTMLImageElement, we have to also mock ImageUtils.resizes() below.
			if (tag === 'img') {
				const mockImage = {
					listeners: new Map<string, (() => void)[]>(),
					addEventListener(event: string, callback: () => void) {
						if (!this.listeners.has(event)) {
							this.listeners.set(event, []);
						}
						this.listeners.get(event)?.push(callback);
					},
					dispatchEvent(event: { type: string }) {
						if (this.listeners.has(event.type)) {
							this.listeners.get(event.type)?.forEach(cb => { cb(); });
						}
					},
					set src(value: string) {
						// When src is set, fire 'load' event asynchronously.
						setTimeout(() => {
							this.dispatchEvent({ type: 'load' });
						}, 0);
					},
				};
				return mockImage as unknown as HTMLImageElement;
			}
			return originalCreateElement.call(document, tag, options);
		});

		// The real implementation keys off of the type of "img", which we can't do since it's a mock, so here we
		// return a dummy canvas.
		vi.spyOn(ImageUtils, 'resize').mockImplementation(
			(img: HTMLImageElement|HTMLCanvasElement, scale= 1): HTMLCanvasElement => {
				const canvas = document.createElement('canvas');
				canvas.width = img.width * scale;
				canvas.height = img.height * scale;
				return canvas;
			});
	});

	afterEach(() => {
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	// Loop through no assetRoot value and an assetRoot value
	describe.each<{ assetRoot: string | undefined }>([
		{ assetRoot: undefined },
		{ assetRoot: 'data:' }, // Kind of hacky, but use the start of our inline GIF image URL
	])('when assetRoot is %d', ({ assetRoot }) => {

		it('constructor, happy path', () => {
			new AssetLoader(1, new AudioSystem(), assetRoot);
		});

		it('addJson() loads the data', async() => {

			window.fetch = vi.fn(() =>
				Promise.resolve({
					ok: true,
					status: 200,
					text: () => Promise.resolve('{ "test": "json" }'),
				} as unknown as Response),
			);

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			// Add something to load, now we're waiting
			const promise = assetLoader.addJson('testJson', '/fake/url.json');
			if (!promise) {
				throw new Error('addJson() returned null');
			}
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Wait for the response and check that we're "done loading" again
			await promise;
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testJson')).toEqual({ test: 'json' });
		});

		// Asking to load two things with the same ID is likely a bug in the app, but still
		// verify the behavior here
		it('addJson() does nothing if data with the given ID is currently being loaded', async() => {

			window.fetch = vi.fn(() =>
				Promise.resolve({
					ok: true,
					text: () => Promise.resolve('{ "test": "json" }'),
				} as unknown as Response),
			);

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			// Add something to load, now we're waiting
			const promise = assetLoader.addJson('testJson', '/fake/url.json');
			if (!promise) {
				throw new Error('addJson() returned null');
			}
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Try to load the same item again - this should change nothing
			void assetLoader.addJson('testJson', '/fake/url.json');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Wait for the response and check that we're "done loading" again
			await promise;
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testJson')).toEqual({ test: 'json' });
		});

		// Asking to load two things with the same ID is likely a bug in the app, but still
		// verify the behavior here
		it('addJson() does nothing if data with the given ID has already been loaded', async() => {

			window.fetch = vi.fn(() =>
				Promise.resolve({
					ok: true,
					text: () => Promise.resolve('{ "test": "json" }'),
				} as unknown as Response),
			);

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			// Add something to load, now we're waiting
			const promise = assetLoader.addJson('testJson', '/fake/url.json');
			if (!promise) {
				throw new Error('addJson() returned null');
			}
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Wait for the response and check that we're "done loading" again
			await promise;
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testJson')).toEqual({ test: 'json' });

			// Try to load the same item again - this should change nothing
			void assetLoader.addJson('testJson', '/fake/url.json');
			expect(assetLoader.isDoneLoading()).toBeTruthy(); // Already loaded 'testJson'
		});

		it('addCanvas() loads the data', async() => {

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			// Add something to load, now we're waiting
			assetLoader.addCanvas('testCanvas',
				'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			await new Promise(r => setTimeout(r, 50));

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testCanvas')).toBeDefined();
		});

		it('addImage() loads the data', async() => {

			window.fetch = vi.fn(() =>
				Promise.resolve({
					ok: true,
					text: () => Promise.resolve('{ "test": "json" }'),
				} as unknown as Response),
			);

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			// Add something to load, now we're waiting
			let imageSrc= 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
			if (assetRoot) {
				imageSrc = imageSrc.substring(assetRoot.length);
			}
			assetLoader.addImage('testImage', imageSrc);
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			await new Promise(r => setTimeout(r, 50));

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testImage')).toBeDefined();
		});

		it('addImageAtlasContents() loads the data', async() => {

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			const atlasInfo: ImageAtlasInfo = {
				prefix: 'testAtlasImages',
				images: [
					{
						id: 'foo',
						x: 0,
						y: 0,
						w: 0,
						h: 0,
					},
				],
			};

			// Add something to load, now we're waiting
			let imageSrc= 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
			if (assetRoot) {
				imageSrc = imageSrc.substring(assetRoot.length);
			}
			assetLoader.addImageAtlasContents('unused', imageSrc, atlasInfo);
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			await new Promise(r => setTimeout(r, 50));

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testAtlasImagesfoo')).toBeDefined();
		});

		it('addSound() loads sound data if audio is enabled in this browser', async() => {

			window.fetch = vi.fn(() =>
				Promise.resolve({
					ok: true,
					arrayBuffer: () => Promise.resolve('soundData'),
				} as unknown as Response),
			);

			// Initially nothing queued up, so we're "done loading"
			const audioSystem: AudioSystem = new AudioSystem();
			expect(audioSystem.init()).toBeTruthy();
			const assetLoader: AssetLoader = new AssetLoader(1, audioSystem, assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			// Add something to load, now we're waiting
			const promise = assetLoader.addSound('testSound', '/fake/sound.ogg');
			if (!promise) {
				throw new Error('addSound() returned null');
			}
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Wait for the response and check that we're "done loading" again
			await promise;
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testSound')).toBeDefined();
		});

		it('addSpriteSheet() loads the data', async() => {

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			// Add something to load, now we're waiting
			assetLoader.addSpriteSheet('testSheet',
				'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
				1, 1, 0, 0, true);
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			await new Promise(r => setTimeout(r, 50));

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testSheet')).toBeDefined();
		});

		it('addTmxMap() works with undefined tilesets', () => {

			const data: TiledMapData = {
				compressionlevel: -1,
				height: 1,
				infinite: false,
				layers: [],
				nextlayerid: 4,
				nextobjectid: 4,
				orientation: 'orthogonal',
				properties: [],
				renderorder: 'right-down',
				tileheight: 16,
				tiledversion: '1.8.3',
				tilewidth: 16,
				tilesets: [],
				type: 'map',
				version: '1.8',
				width: 1,
			};
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			const args: TiledMapArgs = {
				screenWidth: 1,
				screenHeight: 1,
				assets: assetLoader,
			};

			const map: TiledMap = new TiledMap(data, args);

			assetLoader.addTmxMap(map); // No errors
		});

		it('addTmxMap() works with empty tilesets', () => {

			const data: TiledMapData = {
				compressionlevel: -1,
				height: 1,
				infinite: false,
				layers: [],
				nextlayerid: 4,
				nextobjectid: 4,
				orientation: 'orthogonal',
				properties: [],
				renderorder: 'right-down',
				tileheight: 16,
				tiledversion: '1.8.3',
				tilewidth: 16,
				tilesets: [],
				type: 'map',
				version: '1.8',
				width: 1,
			};
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			const args: TiledMapArgs = {
				screenWidth: 1,
				screenHeight: 1,
				assets: assetLoader,
			};

			const map: TiledMap = new TiledMap(data, args);

			assetLoader.addTmxMap(map); // No errors
		});

		it('set() works to manually add a resource', () => {

			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);

			assetLoader.set('foo', 14);
			expect(assetLoader.get('foo')).toEqual(14);
		});
	});
});
