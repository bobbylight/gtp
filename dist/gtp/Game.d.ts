declare module gtp {
    /**
     * A base class for a game.
     *
     * @constructor
     */
    class Game {
        _scale: number;
        canvas: HTMLCanvasElement;
        inputManager: gtp.InputManager;
        _gameTime: number;
        _targetFps: number;
        _interval: number;
        lastTime: number;
        audio: gtp.AudioSystem;
        assets: gtp.AssetLoader;
        clearScreenColor: string;
        fpsColor: string;
        statusMessageRGB: string;
        private _statusMessageColor;
        showFps: boolean;
        frames: number;
        private _fpsMsg;
        private _statusMessage;
        private _statusMessageAlpha;
        private _statusMessageTime;
        state: gtp.State;
        timer: gtp.Timer;
        constructor(args?: any);
        /**
         * Starts the game loop.
         */
        start(): void;
        private _tick();
        /**
         * Called during each tick to update game logic.  The default implementation
         * checks for a shortcut key to toggle the FPS display before delegating to
         * the current game state.  Subclasses can override, but typically update
         * logic is handled by game states.
         */
        update(): void;
        render(): void;
        clearScreen(clearScreenColor?: string): void;
        getGameTime(): number;
        getHeight(): number;
        getWidth(): number;
        randomInt(max: number): number;
        setState(state: gtp.State): void;
        private _renderStatusMessage(ctx);
        private _renderFps(ctx);
        setStatusMessage(message: string): void;
        toggleMuted(): boolean;
        toggleShowFps(): void;
    }
}
