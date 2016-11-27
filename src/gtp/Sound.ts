export default class Sound {

	private _id: string;
	private _buffer: any;
	private _loopsByDefault: boolean;
	private _loopStart: number;

	constructor(id: string, buffer: any, loopStart: number = 0) {
		this._id = id;
		this._buffer = buffer;
		this._loopsByDefault = true;
		this._loopStart = loopStart;
	}

	getBuffer(): any {
		return this._buffer;
	}

	getId(): string {
		return this._id;
	}

	getLoopsByDefaultIfMusic(): boolean {
		return this._loopsByDefault;
	}

	setLoopsByDefaultIfMusic(loopsByDefault: boolean) {
		this._loopsByDefault = loopsByDefault;
	}

	getLoopStart(): number {
		return this._loopStart;
	}

	setLoopStart(loopStart: number) {
		this._loopStart = loopStart;
	}
}
