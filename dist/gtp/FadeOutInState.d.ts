declare module gtp {
    class FadeOutInState extends gtp.State {
        private _leavingState;
        private _enteringState;
        private _transitionLogic;
        private _fadingOut;
        private _alpha;
        private _halfTime;
        private _curTime;
        /**
         * Fades one state out and another state in.
         *
         * @constructor
         */
        constructor(leavingState: gtp.State, enteringState: State, transitionLogic?: Function, timeMillis?: number);
        update(delta: number): void;
        render(ctx: CanvasRenderingContext2D): void;
        /**
         * Sets the new game state.  This is a hook for subclasses to perform
         * extra logic.
         *
         * @param state The new state.
         */
        private _setState(state);
    }
}
