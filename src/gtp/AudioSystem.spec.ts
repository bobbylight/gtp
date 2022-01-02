import AudioSystem from './AudioSystem';
import Sound from './Sound';

describe('AudioSystem', () => {

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
			} as unknown as AudioBufferSourceNode;
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

	it('when web audio is available, it is marked as initialized', () => {
		const audio: AudioSystem = new AudioSystem();
		audio.init();
		expect(audio.isInitialized()).toBeTruthy();
	});

	it('playMusic() starts a track', () => {

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		const mockSound: Sound = new Sound('musicId', buffer);

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		audio.addSound(mockSound);
		audio.playMusic('musicId', true);
	});

	// it('playSound() starts a sound effect', () => {
	//
	// 	const buffer: AudioBuffer = {} as unknown as AudioBuffer;
	// 	const mockSound: Sound = new Sound('soundId', buffer);
	//
	// 	const audio: AudioSystem = new AudioSystem();
	// 	audio.init();
	// 	audio.addSound(mockSound);
	// 	expect(audio.playSound('soundId')).toBeGreaterThan(-1);
	// });

	it('stopMusic() does nothing if no sounds are playing', () => {
		const audio: AudioSystem = new AudioSystem();
		audio.init();
		audio.stopMusic();
	});

	it('stopMusic() will pause the currently-playing music', () => {

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		const mockSound: Sound = new Sound('musicId', buffer);

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		audio.addSound(mockSound);
		audio.playMusic('musicId', true);
		audio.stopMusic(true);
	});

	it('toggleMuted() returns the new mute state', () => {
		const audio: AudioSystem = new AudioSystem();
		expect(audio.toggleMuted()).toBeTruthy();
		expect(audio.toggleMuted()).toBeFalsy();
	});

	it('get/set fadeMusic works', () => {
		const audio: AudioSystem = new AudioSystem();
		expect(audio.fadeMusic).toBeTruthy();
		audio.fadeMusic = false;
		expect(audio.fadeMusic).toBeFalsy();
	});

	it('get/set musicFadeSeconds works', () => {
		const audio: AudioSystem = new AudioSystem();
		audio.musicFadeSeconds = 30;
		expect(audio.musicFadeSeconds).toEqual(30);
	});
});
