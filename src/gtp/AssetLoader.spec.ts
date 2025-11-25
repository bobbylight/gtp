import { AssetLoader, AudioSystem, ImageAtlasInfo, TiledMapData } from '../index.js';
import TiledMap from '../tiled/TiledMap.js';
import { TiledMapArgs } from '../tiled/TiledMapArgs.js';

describe('AssetLoader', () => {

	const mockAudioContext: any/*AudioContext*/ = jest.fn(() => ({
		decodeAudioData: (audioData: ArrayBuffer, successCallback: DecodeSuccessCallback) => {
			successCallback({} as AudioBuffer);
		},
		createBufferSource(): AudioBufferSourceNode {
			return {
				connect: jest.fn(),
				start: jest.fn(),
				stop: jest.fn(),
				disconnect: jest.fn(),
				context: {
					currentTime: 0,
				},
			} as unknown as AudioBufferSourceNode;
		},
		createGain: () => {
			return {
				gain: {
					setValueAtTime: () => {},
					linearRampToValueAtTime: () => {},
				},
				connect: () => {},
				disconnect: () => {},
			};
		},
	}));

	let origAudioContext: any = undefined;

	beforeAll(() => {
		origAudioContext = window.AudioContext;
		window.AudioContext = mockAudioContext;
	});

	afterAll(() => {
		window.AudioContext = origAudioContext;
		jest.resetAllMocks();
		jest.restoreAllMocks();
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

			global.fetch = jest.fn(() =>
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
				fail('addJson() returned null');
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

			global.fetch = jest.fn(() =>
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
				fail('addJson() returned null');
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

			global.fetch = jest.fn(() =>
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
				fail('addJson() returned null');
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

			global.fetch = jest.fn(() =>
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
				fail('addSound() returned null');
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
