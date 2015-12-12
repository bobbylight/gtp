declare module gtp {
    class AssetLoader {
        private _scale;
        private loadingAssetData;
        private responses;
        private callback;
        audio: gtp.AudioSystem;
        private _assetRoot;
        private nextCallback;
        /**
         * Provides methods to load images, sounds, and Tiled maps.
         *
         * @param scale How much to scale image resources.
         * @param audio A web audio context.
         * @constructor
         */
        constructor(scale: number, audio: gtp.AudioSystem, assetRoot?: string);
        /**
         * Starts loading a JSON resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param url {string} The URL of the resource.
         */
        addJson(id: string, url?: string): void;
        /**
         * Starts loading a canvas resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param imageSrc {string} The URL of the resource.
         */
        addCanvas(id: string, imageSrc: string): void;
        /**
         * Starts loading an image resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param imageSrc {string} The URL of the resource.
         */
        addImage(id: string, imageSrc: string): void;
        /**
         * Starts loading a sound resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param soundSrc {string} The URL of the resource.
         * @param {number} [loopStart=0] Where to start, in seconds, if/when this
         *        sound loops (which is typical when using a sound as music).
         * @param {boolean} [loopByDefaultIfMusic=true] Whether this sound should
         *        loop by default when it is played as music.
         */
        addSound(id: string, soundSrc: string, loopStart?: number, loopByDefaultIfMusic?: boolean): void;
        /**
         * Starts loading a sprite sheet resource.
         * @param id {string} The ID to use when retrieving this resource.
         * @param imageSrc {string} The URL of the resource.
         * @param {int} cellW The width of a cell.
         * @param {int} cellH The height of a cell.
         * @param {int} spacingX The horizontal spacing between cells.  Assumed to
         *        be 0 if not defined.
         * @param {int} spacingY The vertical spacing between cells.  Assumed to
         *        be 0 if not defined.
         * @param {boolean} firstPixelTranslucent If truthy, the pixel at (0, 0)
         *        is made translucent, along with all other pixels of the same color.
         */
        addSpriteSheet(id: string, imageSrc: string, cellW: number, cellH: number, spacingX?: number, spacingY?: number, firstPixelTranslucent?: boolean): void;
        /**
         * Registers all images needed by the TMX map's tilesets to this asset
         * loader.
         *
         * @param {tiled.TiledMap} map The Tiled map.
         */
        addTmxMap(map: tiled.TiledMap): void;
        /**
         * Returns the image corresponding to a Tiled tileset.  This method is
         * called by the library and is typically not called directly by the
         * application.
         *
         * @param {tiled.TiledTileset} tileset The tile set.
         * @return The canvas.
         */
        getTmxTilesetImage(tileset: tiled.TiledTileset): gtp.Image;
        /**
         * Retrieves a resource by ID.
         * @param res {string} The ID of the resource.
         * @return The resource, or null if not found.
         */
        get(res: string): any;
        _isAlreadyTracked(id: string): boolean;
        /**
         * Adds a resource.
         * @param res {string} The ID for the resource.
         * @param value {any} The resource value.
         */
        set(res: string, value: any): void;
        _completed(res: string, response: any): void;
        /**
         * Returns whether all assets in thie loader have successfully loaded.
         *
         * @return {boolean} Whether all assets have loaded.
         */
        isDoneLoading(): boolean;
        onLoad(callback: Function): void;
    }
}
declare module gtp {
    enum AssetType {
        UNKNOWN = 0,
        IMAGE = 1,
        AUDIO = 2,
        JSON = 3,
    }
}
/**
 * Extending TypeScript's Window definition so we can check for browser support of
 * AudioContext.
 */
interface Window {
    AudioContext: any;
    webkitAudioContext: any;
}
declare module gtp {
    class AudioSystem {
        private _currentMusic;
        private _sounds;
        private _musicFade;
        private _fadeMusic;
        private _muted;
        private _initialized;
        context: AudioContext;
        private _volumeFaderGain;
        private _musicFaderGain;
        private currentMusicId;
        private _musicLoopStart;
        /**
         * A wrapper around web audio for games.
         *
         * @constructor
         */
        constructor();
        /**
         * Initializes the audio system.
         */
        init(): void;
        /**
         * Registers a sound for later playback.
         * @param sound {gtp.Sound} The sound.
         */
        addSound(sound: gtp.Sound): void;
        fadeOutMusic(newMusicId: string): void;
        /**
         * Returns the ID of the current music being played.
         *
         * @return {string} The current music's ID.
         */
        getCurrentMusic(): string;
        /**
         * Returns whether the audio system initialized properly.  This will return
         * false if the user's browser does not support the web audio API.
         * @return {boolean} Whether the sound system is initialized
         */
        isInitialized(): boolean;
        /**
         * Plays a specific sound as background music.  Only one "music" can play
         * at a time, as opposed to "sounds," of which multiple can be playing at
         * one time.
         * @param {string} id The ID of the resource to play as music.  If this is
         *        <code>null</code>, the current music is stopped but no new music
         *        is started.
         * @param {boolean} loop Whether the music should loop.
         * @see stopMusic
         */
        playMusic(id: string, loop?: boolean): void;
        /**
         * Plays the sound with the given ID.
         * @param {string} id The ID of the resource to play.
         */
        playSound(id: string): void;
        /**
         * Stops the currently playing music, if any.
         * @param {boolean} pause If <code>true</code>, the music is only paused;
         *        otherwise, native resources are freed and the music cannot be
         *        resumed.
         * @see playMusic
         */
        stopMusic(pause?: boolean): void;
        toggleMuted(): boolean;
        fadeMusic: boolean;
        musicFadeSeconds: number;
    }
}
declare module gtp {
    class BitmapFont extends SpriteSheet {
        constructor(gtpImage: Image, cellW: number, cellH: number, spacing: number, spacingY: number);
        drawString(str: string, x: number, y: number): void;
    }
}
declare module gtp {
    /**
     * Utility methods for interfacing with browser APIs.  This stuff is
     * typically hard to unit test, and thus is in this class so it is easily
     * mockable.
     *
     * @constructor
     */
    class BrowserUtil {
        /**
         * Returns <code>window.location.search</code>.
         */
        static getWindowLocationSearch(): string;
    }
}
declare module gtp {
    /**
     * Arguments to the Delay constructor.
     */
    interface DelayArgs {
        millis: any;
        minDelta?: number;
        maxDelta?: number;
        callback?: Function;
        loop?: boolean;
        loopCount?: number;
    }
    /**
     * A way to keep track of a delay.  Useful when you want some event to occur
     * every X milliseconds, for example.
     *
     * @param {object} args Arguments to this delay.
     * @param {number-or-array} args.millis The number of milliseconds between
     *        events.  You can specify an array of numbers to have the even trigger
     *        at non-equal intervals.
     * @param {int} [args.minDelta] If specified, a minimum amount of variance for
     *        the event.  May be negative, but should be larger than the smallest
     *        value specified in millis.
     * @param {int} [args.maxDelta] If specified, a maximum amount of variance for
     *        the event.
     * @param {int} [args.loop] If specified and <code>true</code>, this timer will
     *        automatically repeat and <code>isDone()</code> will never return
     *        <code>true</code>.
     * @param {int} [args.loopCount] This argument is only honored if
     *        <code>args.loop</code> is defined and <code>true</code>.  If true,
     *        this argument is the number of times to loop; if this argument is not
     *        specified, looping will occur indefinitely.
     * @param {function} [args.callback] If specified, a callback function that
     *        will be called when this delay fires.
     * @constructor
     */
    class Delay {
        _initial: number[];
        _initialIndex: number;
        _callback: Function;
        _loop: boolean;
        _loopCount: number;
        _maxLoopCount: number;
        _minDelta: number;
        _maxDelta: number;
        _remaining: number;
        _curInitial: number;
        constructor(args: DelayArgs);
        /**
         * Should be called in the update() method of the current game state to
         * update this Delay.
         *
         * @param {int} delta The time that has elapsed since the last call to this
         *        method.
         */
        update(delta: number): boolean;
        /**
         * Returns the number of times this Delay has looped.
         *
         * @return {int} The number of times this Delay has looped.
         */
        getLoopCount(): number;
        /**
         * Returns the maximum delta value, or -1 if none was defined.
         *
         * @return {int} The maximum delta value.
         * @see getMinDelta()
         */
        getMaxDelta(): number;
        /**
         * Returns the minimum delta value, or -1 if none was defined.
         *
         * @return {int} The minimum delta value.
         * @see getMaxDelta()
         */
        getMinDelta(): number;
        /**
         * Returns the remaining time on this delay.
         *
         * @return {int} The remaining time on this delay.
         */
        getRemaining(): number;
        /**
         * Returns how far along we are in this delay, in the range
         * 0 - 1.
         *
         * @return {int} How far along we are in this delay.
         */
        getRemainingPercent(): number;
        /**
         * Returns whether this Delay has completed.
         *
         * @return {boolean} Whether this Delay has completed.
         */
        isDone(): boolean;
        /**
         * Causes this delay to trigger with a little random variance.
         *
         * @param {int} min The minimum possible variance, inclusive.
         * @param {int} max The maximum possible variance, exclusive.
         */
        setRandomDelta(min: number, max: number): void;
        reset(smooth?: boolean): void;
        toString(): string;
    }
}
declare module gtp {
    class FadeOutInState extends gtp.State {
        private _leavingState;
        private _enteringState;
        private _transitionLogic;
        private _fadingOut;
        private _alpha;
        private _halfTime;
        private _curTime;
        /**
         * Fades one state out and another state in.
         *
         * @constructor
         */
        constructor(leavingState: gtp.State, enteringState: State, transitionLogic?: Function, timeMillis?: number);
        update(delta: number): void;
        render(ctx: CanvasRenderingContext2D): void;
        /**
         * Sets the new game state.  This is a hook for subclasses to perform
         * extra logic.
         *
         * @param state The new state.
         */
        private _setState(state);
    }
}
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
declare module gtp {
    class Image {
        private _canvas;
        x: number;
        y: number;
        private _width;
        private _height;
        /**
         * A wrapper around images.  Handles browser-specific quirks and other things
         * a game shouldn't have to know about.
         *
         * @constructor
         */
        constructor(canvas: HTMLCanvasElement, x?: number, y?: number, w?: number, h?: number);
        /**
         * Chrome has trouble copying from a canvas in RAM to a canvas in GPU memory
         * and vice versa, unless all canvases are >= 256x256.
         */
        _ensure256Square(): void;
        /**
         * Draws this image.
         *
         * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         */
        draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
        /**
         * Draws this image.
         *
         * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} w The width to (possibly) stretch the image to when
         *              drawing.
         * @param {int} h The height to (possibly) stretch the image to when
         *              drawing.
         */
        drawScaled(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
        /**
         * Draws this image.
         *
         * @param {CanvasRenderingContext2D} ctx A canvas' graphics context.
         * @param {int} srcX The x-coordinate at which to draw.
         * @param {int} srcY The y-coordinate at which to draw.
         * @param {int} srcW The width of the (possibly) sub-image to draw.
         * @param {int} srcH The height of the (possibly) sub-image to draw.
         * @param {int} destX The x-coordinate at which to draw.
         * @param {int} destY The y-coordinate at which to draw.
         * @param {int} destW The width to (possibly) stretch the image to when
         *              drawing.
         * @param {int} destH The height to (possibly) stretch the image to when
         *              drawing.
         */
        drawScaled2(ctx: CanvasRenderingContext2D, srcX: number, srcY: number, srcW: number, srcH: number, destX: number, destY: number, destW: number, destH: number): void;
        /**
         * Converts a color of a particular type to completely transparent in this
         * image.
         *
         * @param {int} x The x-coordinate of the pixel whose color to change.  0 will
         *        be used if this parameter is undefined.
         * @param {int} y The y-coordinate of the pixel whose color to change.  0 will
         *        be used if this parameter is undefined.
         * @return {Image} This image, which has been modified.
         * @method
         */
        makeColorTranslucent(x?: number, y?: number): void;
        width: number;
        height: number;
    }
}
declare module gtp {
    class ImageAtlas {
        private _atlasInfo;
        private _masterCanvas;
        constructor(args: any);
        parse(): {
            [id: string]: Image;
        };
    }
}
declare module gtp {
    /**
     * General-purpose utilities for manipulating images in canvases.
     * @constructor
     */
    class ImageUtils {
        /**
         * Takes an img/canvas and a scaling factor and returns the scaled image.
         * @method
         */
        static resize(img: HTMLImageElement | HTMLCanvasElement, scale?: number): HTMLCanvasElement;
        static createCanvas(width: number, height: number, parentDiv?: HTMLElement | string): HTMLCanvasElement;
        static prepCanvas(canvas: HTMLCanvasElement): void;
        /**
         * Converts a color of a particular type to completely transparent in a canvas.
         *
         * @param {Canvas} canvas The canvas to operate on.
         * @param {int} x The x-coordinate of the pixel whose color to change.  0 will
         *        be used if this parameter is undefined.
         * @param {int} y The y-coordinate of the pixel whose color to change.  0 will
         *        be used if this parameter is undefined.
         * @return {Canvas} The original canvas, which has been modified.
         * @method
         */
        static makeColorTranslucent(canvas: HTMLCanvasElement, x?: number, y?: number): HTMLCanvasElement;
    }
}
declare module gtp {
    class InputManager {
        private keys;
        private _refireMillis;
        private _repeatTimers;
        /**
         * Handles input for games.<p>
         *
         * For keyboards, allows polling of individual key presses, both with and
         * without the keyboard repeat delay.<p>
         *
         * Touch and mouse input are currently not supported.
         *
         * @constructor
         * @param {int} [keyRefireMillis=0] What the key refiring time should be, in
         *        milliseconds.  A value of 0 means to take the operating system
         *        default.
         */
        constructor(keyRefireMillis?: number);
        /**
         * Resets a specific key to its "not depressed" state.
         *
         * @param {int} key The key to reset.
         * @see clearKeyStates
         */
        clearKeyState(key: gtp.Keys): void;
        /**
         * Resets all keys to be in their "not depressed" states.
         */
        clearKeyStates(): void;
        /**
         * Returns whether ctrl is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        ctrl(clear?: boolean): boolean;
        /**
         * Returns whether down is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        down(clear?: boolean): boolean;
        /**
         * Returns whether enter is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        enter(clear?: boolean): boolean;
        /**
         * Installs this keyboard manager.  Should be called during game
         * initialization.
         */
        install(): void;
        /**
         * Returns whether a specific key is pressed.
         * @param keyCode {gtp.Keys} A key code.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        isKeyDown(keyCode: number, clear?: boolean): boolean;
        _keyDown(e: KeyboardEvent): void;
        _keyUp(e: KeyboardEvent): void;
        /**
         * Returns whether left is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        left(clear?: boolean): boolean;
        /**
         * Returns whether right is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        right(clear?: boolean): boolean;
        /**
         * Returns whether shift is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        shift(clear?: boolean): boolean;
        /**
         * Returns whether up is pressed.
         * @param clear {boolean} Whether the key's state should be reset to "not
         *        pressed" when this method returns.  This is useful to effectively
         *        enable the keyboard's buffering.
         * @return {boolean} Whether the key was pressed.
         */
        up(clear?: boolean): boolean;
    }
}
declare module gtp {
    enum Keys {
        KEY_ENTER = 13,
        KEY_SHIFT = 16,
        KEY_CTRL = 17,
        KEY_SPACE = 32,
        KEY_LEFT_ARROW = 37,
        KEY_UP_ARROW = 38,
        KEY_RIGHT_ARROW = 39,
        KEY_DOWN_ARROW = 40,
        KEY_0 = 48,
        KEY_1 = 49,
        KEY_2 = 50,
        KEY_3 = 51,
        KEY_4 = 52,
        KEY_5 = 53,
        KEY_6 = 54,
        KEY_7 = 55,
        KEY_8 = 56,
        KEY_9 = 57,
        KEY_A = 65,
        KEY_B = 66,
        KEY_C = 67,
        KEY_D = 68,
        KEY_E = 69,
        KEY_F = 70,
        KEY_G = 71,
        KEY_H = 72,
        KEY_I = 73,
        KEY_J = 74,
        KEY_K = 75,
        KEY_L = 76,
        KEY_M = 77,
        KEY_N = 78,
        KEY_O = 79,
        KEY_P = 80,
        KEY_Q = 81,
        KEY_R = 82,
        KEY_S = 83,
        KEY_T = 84,
        KEY_U = 85,
        KEY_V = 86,
        KEY_W = 87,
        KEY_X = 88,
        KEY_Y = 89,
        KEY_Z = 90,
    }
}
declare module gtp {
    class Rectangle {
        x: number;
        y: number;
        w: number;
        h: number;
        /**
         * A simple rectangle class, containing some useful utility methods.
         *
         * @constructor
         * @param {int} [x=0] The x-coordinate.
         * @param {int} [y=0] The y-coordinate.
         * @param {int} [w=0] The width of the rectangle.
         * @param {int} [h=0] The height of the rectangle.
         */
        constructor(x?: number, y?: number, w?: number, h?: number);
        /**
         * Returns whether this rectangle intersects another.
         *
         * @param {gtp.Rectangle} rect2 Another rectangle to compare against.  This
         *        should not be null.
         * @return {boolean} Whether the two rectangles intersect.
         */
        intersects(rect2: gtp.Rectangle): boolean;
    }
}
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
declare module gtp {
    class SpriteSheet {
        gtpImage: gtp.Image;
        cellW: number;
        cellH: number;
        spacingX: number;
        spacingY: number;
        rowCount: number;
        colCount: number;
        size: number;
        /**
         * Creates a sprite sheet.
         *
         * @param {gtp.Image} gtpImage A GTP image that is the source for the sprite sheet.
         * @param {int} cellW The width of a cell in the sprite sheet.
         * @param {int} cellH The height of a cell in the sprite sheet.
         * @param {int} [spacing=1] Optional empty space between cells.
         * @param {int} [spacingY=spacing] Optional vertical empty space between cells.
         *        Specify only if different than the horizontal spacing.
         * @constructor
         */
        constructor(gtpImage: gtp.Image, cellW: number, cellH: number, spacing?: number, spacingY?: number);
        /**
         * Draws a sprite in this sprite sheet by row and column.
         * @param {CanvasRenderingContext2D} ctx The canvas' context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} row The row in the sprite sheet of the sprite to draw.
         * @param {int} col The column in the sprite sheet of the sprite to draw.
         */
        drawSprite(ctx: CanvasRenderingContext2D, x: number, y: number, row: number, col: number): void;
        /**
         * Draws a sprite in this sprite sheet by index
         * (<code>row*colCount + col</code>).
         * @param {CanvasRenderingContext2D} ctx The canvas' context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} index The index in the sprite sheet of the sprite to draw.
         */
        drawByIndex(ctx: CanvasRenderingContext2D, x: number, y: number, index: number): void;
    }
}
declare module gtp {
    interface BaseStateArgs {
        game: gtp.Game;
    }
    class State {
        game: gtp.Game;
        /**
         * A base class for game states.  Basically just an interface with callbacks
         * for updating and rendering, along with other lifecycle-ish methods.
         *
         * @constructor
         */
        constructor(args?: gtp.Game | BaseStateArgs);
        /**
         * Called right before a state starts.  Subclasses can do any needed
         * initialization here.
         */
        init(): void;
        /**
         * Called when this state is being left for another one.
         */
        leaving(game: any): void;
        /**
         * Subclasses should override this method to do necessary update logic.
         *
         * @param {float} delta The amount of time that has elapsed since the last
         *        frame/call to this method.
         */
        update(delta: number): void;
        /**
         * Subclasses should override this method to render the screen.
         *
         * @param {CanvasRenderingContext2D} ctx The graphics context to render onto.
         */
        render(ctx: CanvasRenderingContext2D): void;
    }
}
declare module gtp {
    class Timer {
        private _startTimes;
        private _prefix;
        /**
         * Allows you to time actions and log their runtimes to the console.
         * @constructor
         */
        constructor();
        /**
         * Sets the prefix to prepend to each line printed to the console.
         *
         * @param {String} prefix The new prefix.  'DEBUG' is used if not defined.
         */
        setLogPrefix(prefix?: string): void;
        /**
         * Starts timing something.
         *
         * @param {String} key A unique key for the thing being timed.
         */
        start(key: string): void;
        /**
         * Stops timing something.
         *
         * @param {String} key The key of the thing being timed.
         */
        end(key: string): number;
        /**
         * Stops timing something and logs its runtime to the console.
         *
         * @param {String} key The key of the thing being timed.
         */
        endAndLog(key: string): void;
    }
}
declare module gtp {
    /**
     * Obligatory utility methods for games.
     * @constructor
     */
    class Utils {
        /**
         * Returns the number of elements in an object.
         *
         * @param {object} obj The object.
         * @return {int} The number of elements in the object.
         */
        static getObjectSize(obj: Object): number;
        /**
         * Returns the value of a request parameter.
         *
         * @param {string} param The name of the request parameter.
         * @return {string} The value of the request parameter, or <code>null</code>
         *         if it was not specified.
         */
        static getRequestParam(param: string): string;
        /**
         * Equivlaent to dojo/_base/hitch, returns a function in a specific scope.
         *
         * @param {object} scope The scope to run the function in (e.g. the value of
         *        "this").
         * @param {function} func The function.
         * @return {function} A function that does the same thing as 'func', but in the
         *         specified scope.
         */
        static hitch(scope: any, func: Function): Function;
        /**
         * Adds the properties of one element into another.
         *
         * @param {object} source The object with properties to mix into another object.
         * @param {object} target The object that will receive the new properties.
         */
        static mixin(source: any, target: any): void;
        /**
         * Returns a random integer between min (inclusive) and max (exclusive).  If
         * max is omitted, the single parameter is treated as the maximum value, and
         * an integer is returned in the range 0 - value.
         *
         * @param {int} [min=0] The minimum possible value, inclusive.
         * @param {int} [max] The maximum possible value, exclusive.
         * @return {int} The random integer value.
         */
        static randomInt(min: number, max: number): number;
        /**
         * Defines console functions for IE9 and other braindead browsers.
         */
        static initConsole(): void;
    }
}
declare module tiled {
    class TiledLayer {
        map: any;
        name: string;
        width: number;
        height: number;
        data: number[];
        opacity: number;
        visible: boolean;
        type: string;
        x: number;
        y: number;
        objects: TiledObject[];
        objectsByName: {
            [name: string]: TiledObject;
        };
        constructor(map: any, data: any);
        getData(row: number, col: number): number;
        setData(row: number, col: number, value: number): boolean;
        private _getIndex(row, col);
        getObjectByName(name: string): TiledObject;
        getObjectIntersecting(x: number, y: number, w: number, h: number): TiledObject;
        isObjectGroup(): boolean;
        private _setObjects(objects);
    }
}
declare module tiled {
    class TiledMap {
        rowCount: number;
        colCount: number;
        tileWidth: number;
        tileHeight: number;
        screenWidth: number;
        screenHeight: number;
        screenRows: number;
        screenCols: number;
        imagePathModifier: Function;
        layers: TiledLayer[];
        layersByName: {
            [name: string]: TiledLayer;
        };
        objectGroups: TiledLayer[];
        tilesets: TiledTileset[];
        properties: any;
        version: number;
        orientation: string;
        /**
         * A 2d game map, generated in Tiled.
         *
         * @constructor
         */
        constructor(data: any, args: any);
        /**
         * Adds a layer to this map.  This method is called internally by the library
         * and the programmer typically does not need to call it.
         *
         * @param {object} layerData The raw layer data.
         * @method
         */
        addLayer(layerData: any): void;
        draw(ctx: CanvasRenderingContext2D, centerRow: number, centerCol: number, dx?: number, dy?: number): void;
        /**
         * Returns a layer by name.
         *
         * @param {string} name The name of the layer.
         * @return {tiled.TiledLayer} The layer, or null if there is no layer with
         *         that name.
         * @method
         */
        getLayer(name: string): TiledLayer;
        /**
         * Returns a layer by index.
         *
         * @param {int} index The index of the layer.
         * @return {tiled.TiledLayer} The layer, or null if there is no layer at
         *         that index.
         * @method
         */
        getLayerByIndex(index: number): TiledLayer;
        /**
         * Returns the number of layers in this map.
         *
         * @return {int} The number of layers in this map.
         */
        getLayerCount(): number;
        private _getImageForGid(gid);
        drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, value: number, layer: TiledLayer): void;
        setScale(scale: number): void;
        /**
         * Returns the pixel width of this map.
         *
         * @return {int} The pixel width of this map.
         * @method
         */
        getPixelWidth(): number;
        /**
         * Returns the pixel height of this map.
         *
         * @return {int} The pixel height of this map.
         * @method
         */
        getPixelHeight(): number;
        /**
         * Removes a layer from this map.
         * @param {string} layerName The name of the layer to remove.
         * @return {boolean} Whether a layer by that name was found.
         * @method
         */
        removeLayer(layerName: string): boolean;
    }
}
interface Window {
    game: any;
}
declare module tiled {
    class TiledObject {
        gid: number;
        x: number;
        y: number;
        width: number;
        height: number;
        properties: {};
        constructor(data: any);
        intersects(ox: number, oy: number, ow: number, oh: number): boolean;
    }
}
declare module tiled {
    class TiledTileset {
        firstgid: number;
        image: string;
        imageWidth: number;
        imageHeight: number;
        margin: number;
        name: string;
        properties: {};
        spacing: number;
        tileWidth: number;
        tileHeight: number;
        constructor(data: any, imagePathModifier?: Function);
        setScale(scale: number): void;
    }
}
