declare module gtp {
    class Sound {
        private _id;
        private _buffer;
        private _loopsByDefault;
        private _loopStart;
        constructor(id: string, buffer: any, loopStart?: number);
        getBuffer(): any;
        getId(): string;
        getLoopsByDefaultIfMusic(): boolean;
        setLoopsByDefaultIfMusic(loopsByDefault: boolean): void;
        getLoopStart(): number;
        setLoopStart(loopStart: number): void;
    }
}
