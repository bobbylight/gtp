import { MockInstance, vi } from 'vitest';

function createMockAudioBuffer(): MockInstance<typeof AudioBuffer> {
	return vi.fn(class {
		// Minimum properties
		duration = 1;
		length = 44100;
		numberOfChannels = 1;
		sampleRate = 44100;

		getChannelData(channel: number): Float32Array<ArrayBuffer> {
			return new Float32Array(this.length); // Return a dummy array
		}
	} as unknown as typeof AudioBuffer);
}

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

export { createMockAudioBuffer, createMockAudioContext };
