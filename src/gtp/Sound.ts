/**
 * Represents a sound effect to play in a game.
 */
export default class Sound {

	private readonly id: string;
	private readonly buffer: AudioBuffer;
	private loopsByDefault: boolean;
	private loopStart: number;

	constructor(id: string, buffer: AudioBuffer, loopStart= 0) {
		this.id = id;
		this.buffer = buffer;
		this.loopsByDefault = true;
		this.loopStart = loopStart;
	}

	getBuffer(): AudioBuffer {
		return this.buffer;
	}

	getId(): string {
		return this.id;
	}

	getLoopsByDefaultIfMusic(): boolean {
		return this.loopsByDefault;
	}

	setLoopsByDefaultIfMusic(loopsByDefault: boolean) {
		this.loopsByDefault = loopsByDefault;
	}

	getLoopStart(): number {
		return this.loopStart;
	}

	setLoopStart(loopStart: number) {
		this.loopStart = loopStart;
	}
}
