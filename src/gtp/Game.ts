import { Keys } from './Keys.js';
import InputManager from './InputManager.js';
import State from './State.js';
import GameTimer from './GameTimer.js';
import Timer from './Timer.js';
import ImageUtils from './ImageUtils.js';
import Utils from './Utils.js';
import AudioSystem from './AudioSystem.js';
import AssetLoader from './AssetLoader.js';

const STATUS_MESSAGE_TIME_INC= 100;
const STATUS_MESSAGE_ALPHA_DEC= 0.1;
const MILLIS_PER_SECOND= 1000;
const DEFAULT_TARGET_FPS= 30;

/**
 * Optional arguments that can be passed to the <code>Game</code> constructor.
 */
export interface GameArgs {
	scale?: number;
	width: number;
	height: number;
	parent?: HTMLElement | string;
	keyRefreshMillis?: number;
	targetFps?: number;
	assetRoot?: string;
}

/**
 * A base class for a game.
 */
export default class Game {

	readonly scale: number;
	readonly canvas: HTMLCanvasElement;
	readonly inputManager: InputManager;
	targetFps: number;
	interval: number;
	lastTime: number;
	audio: AudioSystem;
	assets: AssetLoader;
	clearScreenColor: string;
	fpsColor: string;
	statusMessageRGB: string;
	private statusMessageColor: string | null;
	showFps: boolean;
	frames: number;
	private fpsMsg: string;
	private statusMessage: string | null;
	private statusMessageAlpha: number;
	private statusMessageTime: number;
	state!: State<Game>;
	private readonly gameTimer: GameTimer;
	timer: Timer;

	constructor(args: GameArgs = { width: 640, height: 480 }) {

		Utils.initConsole();

		this.scale = args.scale ?? 1;
		this.canvas = ImageUtils.createCanvas(args.width, args.height, args.parent);

		this.inputManager = new InputManager(args.keyRefreshMillis ?? 0);
		this.inputManager.install();
		this.targetFps = args.targetFps ?? DEFAULT_TARGET_FPS;
		this.interval = MILLIS_PER_SECOND / this.targetFps;
		this.lastTime = 0;

		this.audio = new AudioSystem();
		this.audio.init();
		const assetPrefix: string | undefined = args.assetRoot;
		this.assets = new AssetLoader(this.scale, this.audio, assetPrefix);

		this.clearScreenColor = 'rgb(0,0,0)';

		this.fpsColor = 'rgb(255,255,255)';
		this.statusMessageRGB = '255,255,255';
		this.statusMessageColor = null;
		this.showFps = false;
		this.frames = 0;
		this.fpsMsg = `${this.targetFps} fps`;
		this.statusMessage = null;
		this.statusMessageAlpha = 0;
		this.statusMessageTime = 0;

		this.gameTimer = new GameTimer();
		this.timer = new Timer();
	}

	/**
	 * Clears the screen.
	 * @param clearScreenColor The color to clear the screen with.
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

	/**
	 * A utility method that returns the rendering context for this game's canvas without having
	 * to assert that it's non-null. This is just a simple utility to avoid non-null assertions
	 * in games.
	 *
	 * @return The rendering context for this game's canvas.
	 */
	getRenderingContext(): CanvasRenderingContext2D {
		const ctx = this.canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to get 2D rendering context from canvas.');
		}
		return ctx;
	}

	getWidth(): number {
		return this.canvas.width;
	}

	/**
	 * Returns whether this game is paused.
	 * @return Whether this game is paused.
	 */
	get paused(): boolean {
		return this.gameTimer.paused;
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
		return this.gameTimer.playTime;
	}

	/**
	 * Returns a random number between <code>0</code> and
	 * <code>number</code>, exclusive.
	 *
	 * @param max The upper bound, exclusive.
	 * @return The random number.
	 */
	randomInt(max: number): number {
		const min= 0;
		max = Math.floor(max);
		// Using Math.round() would give a non-uniform distribution!
		return Math.floor(Math.random() * (max - min) + min);
	}

	render() {

		const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
		this.state.render(ctx);

		if (this.showFps) {
			this.renderFps(ctx);
		}
		if (this.statusMessage && this.statusMessageAlpha > 0) {
			this.renderStatusMessage(ctx);
		}
	}

	private renderFps(ctx: CanvasRenderingContext2D) {

		this.frames++;
		const now: number = Utils.timestamp();
		if (now - this.lastTime >= MILLIS_PER_SECOND) {
			this.fpsMsg = `${this.frames} fps`;
			this.frames = 0;
			this.lastTime = now;
		}

		const x= 10;
		const y= 15;
		ctx.font = '10pt Arial';
		ctx.fillStyle = this.fpsColor;
		ctx.fillText(this.fpsMsg, x, y);

	}

	private renderStatusMessage(ctx: CanvasRenderingContext2D) {
		if (this.statusMessage) {
			const x= 10;
			const y: number = this.canvas.height - 6;
			ctx.font = '10pt Arial';
			ctx.fillStyle = this.statusMessageColor ?? '#fff';
			ctx.fillText(this.statusMessage, x, y);
		}
	}

	/**
	 * Resets the "playtime in milliseconds" timer back to <code>0</code>.
	 *
	 * @see playTimeMillis
	 */
	resetPlayTime() {
		this.gameTimer.resetPlayTime();
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
		} else {
			this.audio.resumeAll();
		}
		this.gameTimer.paused = paused;
	}

	setState(state: State<Game>) {
		if (this.state) {
			this.state.leaving(this);
		}
		this.state = state;
		this.state.enter(this);
	}

	setStatusMessage(message: string) {
		this.statusMessage = message;
		this.statusMessageAlpha = 2.0; // 1.0 of message, 1.0 of fading out
		this.statusMessageTime = Utils.timestamp() + STATUS_MESSAGE_TIME_INC;
	}

	/**
	 * Starts the game loop.
	 */
	start() {
		const callback: () => void = this.tick.bind(this);
		this.gameTimer.start();
		setInterval(callback, this.interval);
	}

	private tick() {

		if (this.statusMessage) {
			const time: number = Utils.timestamp();
			if (time > this.statusMessageTime) {
				this.statusMessageTime = time + STATUS_MESSAGE_TIME_INC;
				this.statusMessageAlpha -= STATUS_MESSAGE_ALPHA_DEC;
				const alpha: number = Math.min(1, this.statusMessageAlpha);
				this.statusMessageColor = `rgba(${this.statusMessageRGB},${alpha})`;
				if (this.statusMessageAlpha <= 0) {
					this.statusMessage = null;
				}
			}
		}

		this.update();
		this.render();
	}

	toggleMuted(): boolean {
		const muted: boolean = this.audio.toggleMuted();
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
		this.state.update(this.interval);

	}

}
