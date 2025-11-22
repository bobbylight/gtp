import State from './State.js';
import Game from './Game.js';

const DEFAULT_HALF_TIME_MILLIS= 800;

/**
 * An optional callback called when this transition hits its halfway point (completely faded out,
 * not yet started to fade back in).
 */
export type TransitionLogicCallback = () => void;

/**
 * A transitional state that fades out of one state and fades in another.
 */
export default class FadeOutInState<T extends Game> extends State<T> {

	private readonly leavingState: State<T>;
	private readonly enteringState: State<T>;
	private readonly transitionLogic: TransitionLogicCallback | undefined;
	private fadingOut: boolean;
	private alpha: number;
	private readonly halfTime: number;
	private curTime: number;

	/**
	 * Fades one state out and another state in.
	 */
	constructor(leavingState: State<T>, enteringState: State<T>,
		transitionLogic?: TransitionLogicCallback, timeMillis?: number) {
		super();
		this.leavingState = leavingState;
		this.enteringState = enteringState;
		this.transitionLogic = transitionLogic;
		this.fadingOut = true;
		this.alpha = 1;
		this.halfTime = timeMillis && timeMillis > 0 ? timeMillis / 2 : DEFAULT_HALF_TIME_MILLIS;
		this.curTime = 0;
	}

	override update(delta: number) {

		super.update(delta);
		this.curTime += delta;
		if (this.curTime >= this.halfTime) {
			this.curTime -= this.halfTime;
			if (this.fadingOut) {
				this.fadingOut = false;
				this.transitionLogic?.();
			} else {
				this.setState(this.enteringState);
				return;
			}
		}

		this.alpha = this.fadingOut ? 1 - (this.curTime / this.halfTime) : (this.curTime / this.halfTime);
	}

	override render(ctx: CanvasRenderingContext2D) {

		super.render(ctx);
		this.game.clearScreen();

		const previousAlpha: number = ctx.globalAlpha;
		ctx.globalAlpha = this.alpha;
		if (this.fadingOut) {
			this.leavingState.render(ctx);
		} else {
			this.enteringState.render(ctx);
		}
		ctx.globalAlpha = previousAlpha;
	}

	/**
	 * Sets the new game state.  This is a hook for subclasses to perform
	 * extra logic.
	 *
	 * @param state The new state.
	 */
	private setState(state: State<T>) {
		this.game.setState(this.enteringState);
	}
}
