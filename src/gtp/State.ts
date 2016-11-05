module gtp {
	'use strict';

	/**
	 * Arguments to pass to a state's constructor.
	 */
	export interface BaseStateArgs {
		game: gtp.Game;
	}

	/**
	 * A base class for game states.  Basically just an interface with callbacks
	 * for updating and rendering, along with other lifecycle-ish methods.
	 * @class
	 */
	export class State {

		game: gtp.Game;

		/**
		 * A base class for game states.  Basically just an interface with callbacks
		 * for updating and rendering, along with other lifecycle-ish methods.
		 * @class
		 * @constructor
		 * @param args Arguments to the game state.
		 */
		constructor(args?: Game|BaseStateArgs) {
			if (args && args instanceof Game) {
				this.game = args;
			}
			else if (args) {
				this.game = (<BaseStateArgs>args).game;
			}
			else { // Default to global game object
				this.game = window.game;
			}
		}

		/**
		 * Called right before a state starts.  Subclasses can do any needed
		 * initialization here.
		 * @param {Game} game The game being played.
		 * @see leaving
		 */
		enter(game: Game) {
			// Subclasses can override
		}

		/**
		 * Called when this state is being left for another one.
		 * @param {Game} game The game being played.
		 * @see enter
		 */
		leaving(game: Game) {
		}

		/**
		 * Subclasses should override this method to do necessary update logic.
		 *
		 * @param {number} delta The amount of time that has elapsed since the last
		 *        frame/call to this method, as a floating point number.
		 */
		update(delta: number) {
			// Subclasses should override
		}

		/**
		 * Subclasses should override this method to render the screen.
		 *
		 * @param {CanvasRenderingContext2D} ctx The graphics context to render onto.
		 */
		render(ctx: CanvasRenderingContext2D) {
			// Subclasses should override
		}
	}

}
