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
