import { Keys } from './Keys';
import InputManager from './InputManager';
import State from './State';
import { _GameTimer } from './_GameTimer';
import Timer from './Timer';
import ImageUtils from './ImageUtils';
import Utils from './Utils';
import AudioSystem from './AudioSystem';
import AssetLoader from './AssetLoader';

/**
 * A base class for a game.
 *
 * @constructor
 */
export default class Game {

	/*private */_scale: number;
	canvas: HTMLCanvasElement;
	inputManager: InputManager;
	_targetFps: number;
	_interval: number;
	lastTime: number;
	audio: AudioSystem;
	assets: AssetLoader;
	clearScreenColor: string;
	fpsColor: string;
	statusMessageRGB: string;
	private _statusMessageColor: string | null;
	showFps: boolean;
	frames: number;
	private _fpsMsg: string;
	private _statusMessage: string | null;
	private _statusMessageAlpha: number;
	private _statusMessageTime: number;
	state: State;
	private _gameTimer: _GameTimer;
	timer: Timer;

	constructor(args: any = {}) {

		Utils.initConsole();

		this._scale = args.scale || 1;
		this.canvas = ImageUtils.createCanvas(args.width, args.height, args.parent);

		this.inputManager = new InputManager(args.keyRefreshMillis || 0);
		this.inputManager.install();
		this._targetFps = args.targetFps || 30;
		this._interval = 1000 / this._targetFps;
		this.lastTime = 0;

		this.audio = new AudioSystem();
		this.audio.init();
		const assetPrefix: string = args.assetRoot || null;
		this.assets = new AssetLoader(this._scale, this.audio, assetPrefix);

		this.clearScreenColor = 'rgb(0,0,0)';

		this.fpsColor = 'rgb(255,255,255)';
		this.statusMessageRGB = '255,255,255';
		this._statusMessageColor = null;
		this.showFps = false;
		this.frames = 0;
		this._fpsMsg = this._targetFps + ' fps';
		this._statusMessage = null;
		this._statusMessageAlpha = 0;

		this._gameTimer = new _GameTimer();
		this.timer = new Timer();
	}

	/**
	 * Clears the screen.
	 * @param {string} clearScreenColor The color to clear the screen with.
	 *        If unspecified, <code>this.clearScreenColor</code> is used.
	 */
	clearScreen(clearScreenColor: string = this.clearScreenColor) {
		const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
		ctx.fillStyle = clearScreenColor;
		ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
	}

	getHeight(): number {
		return this.canvas.height;
	}

	getWidth(): number {
		return this.canvas.width;
	}

	/**
	 * Returns whether this game is paused.
	 * @return {boolean} Whether this game is paused.
	 */
	get paused(): boolean {
		return this._gameTimer.paused;
	}

	/**
	 * Returns the length of time the game has been played so far.  This is
	 * "playable time;" that is, time in which the user is playing, and the
	 * game is not paused or in a "not updating" state (such as the main
	 * frame not having focus).
	 *
	 * @return The amount of time the game has been played, in milliseconds.
	 * @see resetPlayTime
	 */
	get playTime(): number {
		return this._gameTimer.playTime;
	}

	/**
	 * Returns a random number between <code>0</code> and
	 * <code>number</code>, exclusive.
	 *
	 * @param max {number} The upper bound, exclusive.
	 * @return {number} The random number.
	 */
	randomInt(max: number): number {
		const min: number = 0;
		// Using Math.round() would give a non-uniform distribution!
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	render() {

		const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
		this.state.render(ctx);

		if (this.showFps) {
			this._renderFps(ctx);
		}
		if (this._statusMessage && this._statusMessageAlpha > 0) {
			this._renderStatusMessage(ctx);
		}
	}

	private _renderFps(ctx: CanvasRenderingContext2D) {

		this.frames++;
		const now: number = Utils.timestamp();
		if (this.lastTime === null) {
			this.lastTime = now;
		}
		else if (now - this.lastTime >= 1000) {
			this._fpsMsg = this.frames + ' fps';
			this.frames = 0;
			this.lastTime = now;
		}

		const x: number = 10;
		const y: number = 15;
		ctx.font = '10pt Arial';
		ctx.fillStyle = this.fpsColor;
		ctx.fillText(this._fpsMsg, x, y);

	}

	private _renderStatusMessage(ctx: CanvasRenderingContext2D) {
		if (this._statusMessage) {
			const x: number = 10;
			const y: number = this.canvas.height - 6;
			ctx.font = '10pt Arial';
			ctx.fillStyle = this._statusMessageColor || '#fff';
			ctx.fillText(this._statusMessage, x, y);
		}
	}

	/**
	 * Resets the "playtime in milliseconds" timer back to <code>0</code>.
	 *
	 * @see playTimeMillis
	 */
	resetPlayTime() {
		this._gameTimer.resetPlayTime();
	}

	/**
	 * Sets whether the game is paused.  The game is still told to handle
	 * input, update itself and render.  This is simply a flag that should
	 * be set whenever a "pause" screen is displayed.  It stops the "in-game
	 * timer" until the game is unpaused.
	 *
	 * @param paused Whether the game should be paused.
	 */
	set paused(paused: boolean) {
		if (paused) {
			this.audio.pauseAll();
		}
		else {
			this.audio.resumeAll();
		}
		this._gameTimer.paused = paused;
	}

	setState(state: State) {
		if (this.state) {
			this.state.leaving(this);
		}
		this.state = state;
		this.state.enter(this);
	}

	setStatusMessage(message: string) {
		this._statusMessage = message;
		this._statusMessageAlpha = 2.0; // 1.0 of message, 1.0 of fading out
		this._statusMessageTime = Utils.timestamp() + 100;
	}

	/**
	 * Starts the game loop.
	 */
	start() {
		const callback: Function = Utils.hitch(this, this._tick);
		this._gameTimer.start();
		setInterval(callback, this._interval);
	}

	private _tick() {

		if (this._statusMessage) {
			const time: number = Utils.timestamp();
			if (time > this._statusMessageTime) {
				this._statusMessageTime = time + 100;
				this._statusMessageAlpha -= 0.1;
				const alpha: number = Math.min(1, this._statusMessageAlpha);
				this._statusMessageColor = 'rgba(' + this.statusMessageRGB + ',' + alpha + ')';
				if (this._statusMessageAlpha <= 0) {
					this._statusMessage = null;
				}
			}
		}

		this.update();
		this.render();
	}

	toggleMuted(): boolean {
		let muted: boolean = this.audio.toggleMuted();
		this.setStatusMessage(muted ? 'Audio muted' : 'Audio enabled');
		return muted;
	}

	toggleShowFps() {
		this.showFps = !this.showFps;
		this.setStatusMessage('FPS display: ' + (this.showFps ? 'on' : 'off'));
	}

	/**
	 * Called during each tick to update game logic.  The default implementation
	 * checks for a shortcut key to toggle the FPS display before delegating to
	 * the current game state.  Subclasses can override, but typically update
	 * logic is handled by game states.
	 */
	update() {

		const im: InputManager = this.inputManager;
		if (im.isKeyDown(Keys.KEY_SHIFT)) {

			if (im.isKeyDown(Keys.KEY_F, true)) {
				this.toggleShowFps();
			}

		}
		this.state.update(this._interval);

	}

}
