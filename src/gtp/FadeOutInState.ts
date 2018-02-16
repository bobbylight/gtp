import State from './State';

const DEFAULT_HALF_TIME_MILLIS: number = 800;

/**
 * A transitional state that fades out of one state and fades in another.
 */
export default class FadeOutInState extends State {

	private readonly _leavingState: State;
	private readonly _enteringState: State;
	private readonly _transitionLogic: Function | undefined;
	private _fadingOut: boolean;
	private _alpha: number;
	private readonly _halfTime: number;
	private _curTime: number;

	/**
	 * Fades one state out and another state in.
	 */
	constructor(leavingState: State, enteringState: State,
		transitionLogic?: Function, timeMillis?: number) {
		super();
		this._leavingState = leavingState;
		this._enteringState = enteringState;
		this._transitionLogic = transitionLogic;
		this._fadingOut = true;
		this._alpha = 1;
		this._halfTime = timeMillis && timeMillis > 0 ? timeMillis / 2 : DEFAULT_HALF_TIME_MILLIS;
		this._curTime = 0;
	}

	update(delta: number) {

		super.update(delta);
		//         console.log('delta === ' + delta);
		this._curTime += delta;
		if (this._curTime >= this._halfTime) {
			this._curTime -= this._halfTime;
			if (this._fadingOut) {
				this._fadingOut = false;
				if (this._transitionLogic) {
					this._transitionLogic();
				}
			}
			else {
				this._setState(this._enteringState);
				return;
			}
		}

		this._alpha = this._fadingOut ? 1 - (this._curTime / this._halfTime) : (this._curTime / this._halfTime);
	}

	render(ctx: CanvasRenderingContext2D) {

		super.render(ctx);
		this.game.clearScreen();

		const previousAlpha: number = ctx.globalAlpha;
		ctx.globalAlpha = this._alpha;
		if (this._fadingOut) {
			this._leavingState.render(ctx);
		}
		else {
			this._enteringState.render(ctx);
		}
		ctx.globalAlpha = previousAlpha;
	}

	/**
	 * Sets the new game state.  This is a hook for subclasses to perform
	 * extra logic.
	 *
	 * @param state The new state.
	 */
	private _setState(state: State) {
		this.game.setState(this._enteringState);
	}
}
