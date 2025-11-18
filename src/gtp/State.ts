import Game from './Game';
import { Window } from './GtpBase';

/**
 * Arguments to pass to a state's constructor.
 */
export interface BaseStateArgs<T extends Game> {
	game: T;
}

/**
 * A base class for game states.  Basically just an interface with callbacks
 * for updating and rendering, along with other lifecycle-ish methods.
 */
export class State<T extends Game> {

	game: T;

	/**
	 * A base class for game states.  Basically just an interface with callbacks
	 * for updating and rendering, along with other lifecycle-ish methods.
	 * @param args Arguments to the game state.
	 */
	constructor(args?: T | BaseStateArgs<T>) {
		if (args && args instanceof Game) {
			this.game = args;
		} else if (args) {
			this.game = args.game;
		} else { // Default to global game object
			const gameWindow: Window = window as any;
			this.game = gameWindow.game as T;
		}
	}

	/**
	 * Called right before a state starts.  Subclasses can do any needed
	 * initialization here.
	 * @param game The game being played.
	 * @see leaving
	 */
	enter(game: T) {
		// Subclasses can override
	}

	/**
	 * Called when this state is being left for another one.
	 * @param game The game being played.
	 * @see enter
	 */
	leaving(game: T) {
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
