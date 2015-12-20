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
        private _gameTimer;
        timer: gtp.Timer;
        constructor(args?: any);
        clearScreen(clearScreenColor?: string): void;
        getHeight(): number;
        getWidth(): number;
        /**
         * Returns whether this game is paused.
         * @return {boolean} Whether this game is paused.
         */
        /**
         * Sets whether the game is paused.  The game is still told to handle
         * input, update itself and render.  This is simply a flag that should
         * be set whenever a "pause" screen is displayed.  It stops the "in-game
         * timer" until the game is unpaused.
         *
         * @param paused Whether the game should be paused.
         */
        paused: boolean;
        /**
         * Returns the length of time the game has been played so far.  This is
         * "playable time;" that is, time in which the user is playing, and the
         * game is not paused or in a "not updating" state (such as the main
         * frame not having focus).
         *
         * @return The amount of time the game has been played, in milliseconds.
         * @see resetPlayTime
         */
        playTime: number;
        /**
         * Returns a random number between <code>0</code> and
         * <code>number</code>, exclusive.
         *
         * @param max {number} The upper bound, exclusive.
         * @return {number} The random number.
         */
        randomInt(max: number): number;
        render(): void;
        private _renderFps(ctx);
        private _renderStatusMessage(ctx);
        /**
         * Resets the "playtime in milliseconds" timer back to <code>0</code>.
         *
         * @see playTimeMillis
         */
        resetPlayTime(): void;
        setState(state: gtp.State): void;
        setStatusMessage(message: string): void;
        /**
         * Starts the game loop.
         */
        start(): void;
        private _tick();
        toggleMuted(): boolean;
        toggleShowFps(): void;
        /**
         * Called during each tick to update game logic.  The default implementation
         * checks for a shortcut key to toggle the FPS display before delegating to
         * the current game state.  Subclasses can override, but typically update
         * logic is handled by game states.
         */
        update(): void;
    }
}
