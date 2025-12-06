import Game from './Game.js';

/**
 * A base class for game states.  Basically just an interface with callbacks
 * for updating and rendering, along with other lifecycle-ish methods.
 */
export class State<T extends Game> {

	readonly game: T;

	/**
	 * A base class for game states.  Basically just an interface with callbacks
	 * for updating and rendering, along with other lifecycle-ish methods.
	 * @param game The parent game.
	 */
	constructor(game: T) {
		this.game = game;
	}

	/**
	 * Called right before a state starts.  Subclasses can do any needed
	 * initialization here.
	 * @see leaving
	 */
	enter() {
		// Subclasses can override
	}

	/**
	 * Called when this state is being left for another one.
	 * @see enter
	 */
	leaving() {
	}

	/**
	 * Subclasses should override this method to do necessary update logic.
	 *
	 * @param delta The amount of time that has elapsed since the last
	 *        frame/call to this method, as a floating point number.
	 */
	update(delta: number) {
		// Subclasses should override
	}

	/**
	 * Subclasses should override this method to render the screen.
	 *
	 * @param ctx The graphics context to render onto.
	 */
	render(ctx: CanvasRenderingContext2D) {
		// Subclasses should override
	}
}

export default State;
