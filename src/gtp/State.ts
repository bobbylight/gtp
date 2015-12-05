module gtp {
    'use strict';

    interface BaseStateArgs {
        game: gtp.Game;
    }

    export class State {

        game: gtp.Game;

		/**
		 * A base class for game states.  Basically just an interface with callbacks
		 * for updating and rendering, along with other lifecycle-ish methods.
		 * 
		 * @constructor
		 */
        constructor(args?: gtp.Game|BaseStateArgs) {
            if (args instanceof gtp.Game) {
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
         */
        init() {
            // Subclasses can override
        }
   
        /**
         * Called when this state is being left for another one.
         */
        leaving(game: any) {
        }
   
        /**
         * Subclasses should override this method to do necessary update logic.
         * 
         * @param {float} delta The amount of time that has elapsed since the last
         *        frame/call to this method.
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
