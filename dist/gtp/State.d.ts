declare module gtp {
    /**
     * Arguments to pass to a state's constructor.
     */
    interface BaseStateArgs {
        game: gtp.Game;
    }
    /**
     * A base class for game states.  Basically just an interface with callbacks
     * for updating and rendering, along with other lifecycle-ish methods.
     * @class
     */
    class State {
        game: gtp.Game;
        /**
         * A base class for game states.  Basically just an interface with callbacks
         * for updating and rendering, along with other lifecycle-ish methods.
         * @class
         * @constructor
         * @param args Arguments to the game state.
         */
        constructor(args?: Game | BaseStateArgs);
        /**
         * Called right before a state starts.  Subclasses can do any needed
         * initialization here.
         * @param {Game} game The game being played.
         * @see leaving
         */
        enter(game: Game): void;
        /**
         * Called when this state is being left for another one.
         * @param {Game} game The game being played.
         * @see enter
         */
        leaving(game: Game): void;
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
