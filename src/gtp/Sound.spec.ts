import { Sound } from '../index';

describe('Sound', () => {

	it('constructor happy path, no loop start', () => {
		const sound: Sound = new Sound('id', 'buffer');
		expect(sound.getId()).toBe('id');
		expect(sound.getBuffer()).toBe('buffer');
		expect(sound.getLoopStart()).toBe(0);
	});

	it('constructor happy path, with loop start', () => {
		const sound: Sound = new Sound('id', 'buffer', 42);
		expect(sound.getId()).toBe('id');
		expect(sound.getBuffer()).toBe('buffer');
		expect(sound.getLoopStart()).toBe(42);
	});

	it('get/set loopsByDefaultIfMusic', () => {
		const sound: Sound = new Sound('id', 'buffer', 42);
		expect(sound.getLoopsByDefaultIfMusic()).toBeTruthy();
		sound.setLoopsByDefaultIfMusic(false);
		expect(sound.getLoopsByDefaultIfMusic()).toBeFalsy();
	});

	it('get/set loopStart', () => {
		const sound: Sound = new Sound('id', 'buffer', 42);
		expect(sound.getLoopStart()).toBe(42);
		sound.setLoopStart(17);
		expect(sound.getLoopStart()).toBe(17);
	});
});
