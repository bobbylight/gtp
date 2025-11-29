import { MockInstance, vi } from 'vitest';

/**
 * AudioContext isn't defined in the node/jsdom test environment, so this mocks out just the pieces we need
 * to initialize it.
 */
function createMockAudioContext(): MockInstance<typeof AudioContext> {
	return vi.fn(class {
		decodeAudioData = (audioData: ArrayBuffer, successCallback: DecodeSuccessCallback) => {
			successCallback({} as AudioBuffer);
		};
		createBufferSource = (): AudioBufferSourceNode => {
			return {
				connect: vi.fn(),
				start: vi.fn(),
				stop: vi.fn(),
				disconnect: vi.fn(),
				context: {
					currentTime: 0,
				},
			} as unknown as AudioBufferSourceNode;
		};
		createGain = (): GainNode => {
			return {
				gain: {
					setValueAtTime: () => {},
					linearRampToValueAtTime: () => {},
				},
				connect: () => {},
				disconnect: () => {},
			} as unknown as GainNode;
		};
	});
}

export { createMockAudioContext };
