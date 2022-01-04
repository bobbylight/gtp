import { AssetLoader, AudioSystem, ImageAtlasInfo, TiledMapData } from '../index';
import TiledMap from '../tiled/TiledMap';
import { TiledMapArgs } from '../tiled/TiledMapArgs';

describe('AssetLoader', () => {

	const xhrMock: any = {
		open: jest.fn(),
		send: jest.fn(),
		onerror: jest.fn()
	};

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
		}
	}));

	let origXmlHttpRequest: any = undefined;
	let origAudioContext: any = undefined;

	beforeAll(() => {
		origXmlHttpRequest = window.XMLHttpRequest;
		origAudioContext = window.AudioContext;
		window.AudioContext = mockAudioContext;
	});

	afterAll(() => {
		window.XMLHttpRequest = origXmlHttpRequest;
		window.AudioContext = origAudioContext;
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	// Loop through no assetRoot value and an assetRoot value
	describe.each`
		assetRoot
		${undefined}
		${'foo'}
	`('when assetRoot is $assetRoot', ({ assetRoot }) => {
		it('constructor, happy path', () => {
			new AssetLoader(1, new AudioSystem());
		});

		it('addJson() loads the data', () => {

			window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			expect(assetLoader.get('testJson')).toBeUndefined();

			// Add something to load, now we're waiting
			assetLoader.addJson('testJson', '/fake/url.json');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Mock a response, which triggers AssetLoader to receive the response as well
			xhrMock.readyState = XMLHttpRequest.DONE;
			xhrMock.responseText = '{"test": "json"}';
			xhrMock.onreadystatechange();

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testJson')).toEqual({ test: 'json' });
		});

		// Asking to load two things with the same ID is likely a bug in the app, but still
		// verify the behavior here
		it('addJson() does nothing if data with the given ID is currently being loaded', () => {

			window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			expect(assetLoader.get('testJson')).toBeUndefined();

			// Add something to load, now we're waiting
			assetLoader.addJson('testJson', '/fake/url.json');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Try to load the same item again - this should change nothing
			assetLoader.addJson('testJson', '/fake/url.json');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Mock a response, which triggers AssetLoader to receive the response as well
			xhrMock.readyState = XMLHttpRequest.DONE;
			xhrMock.responseText = '{"test": "json"}';
			xhrMock.onreadystatechange();

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testJson')).toEqual({ test: 'json' });
		});

		// Asking to load two things with the same ID is likely a bug in the app, but still
		// verify the behavior here
		it('addJson() does nothing if data with the given ID has already been loaded', () => {

			window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem(), assetRoot);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			expect(assetLoader.get('testJson')).toBeUndefined();

			// Add something to load, now we're waiting
			assetLoader.addJson('testJson', '/fake/url.json');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Mock a response, which triggers AssetLoader to receive the response as well
			xhrMock.readyState = XMLHttpRequest.DONE;
			xhrMock.responseText = '{"test": "json"}';
			xhrMock.onreadystatechange();

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testJson')).toEqual({ test: 'json' });

			// Try to load the same item again - this should change nothing
			assetLoader.addJson('testJson', '/fake/url.json');
			expect(assetLoader.isDoneLoading()).toBeTruthy(); // Already loaded 'testJson'
		});

		it('addCanvas() loads the data', async () => {

			window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			expect(assetLoader.get('testCanvas')).toBeUndefined();

			// Add something to load, now we're waiting
			assetLoader.addCanvas('testCanvas',
				'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			await new Promise(r => setTimeout(r, 50));

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testCanvas')).toBeDefined();
		});

		it('addImage() loads the data', async () => {

			window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			expect(assetLoader.get('testImage')).toBeUndefined();

			// Add something to load, now we're waiting
			assetLoader.addImage('testImage',
				'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			await new Promise(r => setTimeout(r, 50));

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testImage')).toBeDefined();
		});

		it('addImageAtlasContents() loads the data', async () => {

			window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			expect(assetLoader.get('testImage')).toBeUndefined();

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
			assetLoader.addImageAtlasContents('unused',
				'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
				atlasInfo);
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			await new Promise(r => setTimeout(r, 50));

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testAtlasImagesfoo')).toBeDefined();
		});

		it('addSound() loads sound data if audio is enabled in this browser', () => {

			window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

			// Initially nothing queued up, so we're "done loading"
			const audioSystem: AudioSystem = new AudioSystem();
			expect(audioSystem.init()).toBeTruthy();
			const assetLoader: AssetLoader = new AssetLoader(1, audioSystem);
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			expect(assetLoader.get('testSound')).toBeUndefined();

			// Add something to load, now we're waiting
			assetLoader.addSound('testSound', '/fake/sound.ogg');
			expect(assetLoader.isDoneLoading()).toBeFalsy();

			// Mock a response, which triggers AssetLoader to receive the response as well
			xhrMock.readyState = XMLHttpRequest.DONE;
			xhrMock.response = new ArrayBuffer(10);
			xhrMock.onload();

			// Now that we've received the response, check that we're "done loading" again
			expect(assetLoader.isDoneLoading()).toBeTruthy();
			expect(assetLoader.get('testSound')).toBeDefined();
		});

		it('addSpriteSheet() loads the data', async () => {

			window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

			// Initially nothing queued up, so we're "done loading"
			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());
			expect(assetLoader.isDoneLoading()).toBeTruthy();

			expect(assetLoader.get('testImage')).toBeUndefined();

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
				width: 1,
				height: 1,
				version: 1,
				layers: [],
				properties: [],
				orientation: 'not-sure',
			};
			const args: TiledMapArgs = {
				tileWidth: 16,
				tileHeight: 16,
				screenWidth: 1,
				screenHeight: 1,
			};

			const map: TiledMap = new TiledMap(data, args);

			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());

			assetLoader.addTmxMap(map); // No errors
		});

		it('addTmxMap() works with empty tilesets', () => {

			const data: TiledMapData = {
				width: 1,
				height: 1,
				version: 1,
				layers: [],
				properties: [],
				orientation: 'not-sure',
				tilesets: [],
			};
			const args: TiledMapArgs = {
				tileWidth: 16,
				tileHeight: 16,
				screenWidth: 1,
				screenHeight: 1,
			};

			const map: TiledMap = new TiledMap(data, args);

			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());

			assetLoader.addTmxMap(map); // No errors
		});

		it('set() works to manually add a resource', () => {

			const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());
			expect(assetLoader.get('foo')).toBeUndefined();

			assetLoader.set('foo', 14);
			expect(assetLoader.get('foo')).toEqual(14);
		});
	});
});
