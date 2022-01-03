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

	let origAudioContext: any = undefined;
	let origAudioNode: any = undefined;

	beforeAll(() => {

		origAudioContext = window.AudioContext;
		window.AudioContext = mockAudioContext;

		origAudioNode = window.AudioNode;
		if (!window.AudioNode) {
			(window as any).AudioNode = () => {
			};
		}
	});

	afterAll(() => {
		window.AudioContext = origAudioContext;
		window.AudioNode = origAudioNode;
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	afterEach(() => {
		jest.useRealTimers(); // Some tests use fake timers
	});

	it('when web audio is available, it is marked as initialized', () => {
		const audio: AudioSystem = new AudioSystem();
		audio.init();
		expect(audio.isInitialized()).toBeTruthy();
	});

	it('fadeOutMusic() fades out the current music, and plays nothing if no new music is specified', () => {

		jest.useFakeTimers();

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		expect(audio.getCurrentMusic()).toBeUndefined();

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		audio.addSound(new Sound('musicId', buffer));
		audio.playMusic('musicId', true);

		audio.fadeOutMusic();
		jest.runAllTimers();
		expect(audio.getCurrentMusic()).toBeUndefined();
	});

	it('fadeOutMusic() fades out the current music, then starts the new one', () => {

		jest.useFakeTimers();

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		expect(audio.getCurrentMusic()).toBeUndefined();

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		audio.addSound(new Sound('musicId1', buffer));
		audio.addSound(new Sound('musicId2', buffer));
		audio.playMusic('musicId1', true);

		audio.fadeOutMusic('musicId2');
		jest.runAllTimers();
		expect(audio.getCurrentMusic()).toEqual('musicId2');
	});

	it('fadeOutMusic() immediately plays the new music if nothing is currently playing', () => {

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		expect(audio.getCurrentMusic()).toBeUndefined();

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		audio.addSound(new Sound('musicId', buffer));

		audio.fadeOutMusic('musicId');
		expect(audio.getCurrentMusic()).toEqual('musicId');
	});

	it('getCurrentMusic() returns the currently playing music', () => {

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		expect(audio.getCurrentMusic()).toBeUndefined();

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		const mockSound: Sound = new Sound('musicId', buffer);
		audio.addSound(mockSound);
		audio.playMusic('musicId', true);
		expect(audio.getCurrentMusic()).toEqual('musicId');
	});

	it('playMusic() starts a track', () => {

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		const mockSound: Sound = new Sound('musicId', buffer);

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		audio.addSound(mockSound);
		audio.playMusic('musicId', true);
	});

	it('playSound() starts a sound effect', () => {

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		const mockSound: Sound = new Sound('soundId', buffer);

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		audio.addSound(mockSound);
		expect(audio.playSound('soundId')).toBeGreaterThan(-1);
	});

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

	it('stopMusic() will stop currently-playing music', () => {

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		const mockSound: Sound = new Sound('musicId', buffer);

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		audio.addSound(mockSound);
		audio.playMusic('musicId', true);
		audio.stopMusic();
	});

	it('stopSound() stops a playing sound effect', () => {

		const buffer: AudioBuffer = {} as unknown as AudioBuffer;
		const mockSound: Sound = new Sound('soundId', buffer);

		const audio: AudioSystem = new AudioSystem();
		audio.init();
		audio.addSound(mockSound);
		const id: number = audio.playSound('soundId');

		expect(audio.stopSound(id)).toBeTruthy();
	});

	it('stopSound() returns false if a sound effect is not playing', () => {
		const audio: AudioSystem = new AudioSystem();
		audio.init();
		expect(audio.stopSound(1)).toBeFalsy();
	});

	it('toggleMuted() returns the new mute state', () => {
		const audio: AudioSystem = new AudioSystem();
		audio.init();
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
