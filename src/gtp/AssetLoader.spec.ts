import {AssetLoader, AudioSystem} from '../index';

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
		createGain: () => {
			return {
				gain: {
					setValueAtTime: () => {}
				},
				connect: () => {}
			};
		}
	}));

	let origXmlHttpRequest: any | undefined = undefined;
	let origAudioContext: any | undefined = undefined;

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

	it('constructor, happy path', () => {
		new AssetLoader(1, new AudioSystem());
	});

	it('addJson() loads the data', () => {

		window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock) as any;

		// Initially nothing queued up, so we're "done loading"
		const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());
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
});
