var gtp;
(function (gtp) {
    'use strict';
    var State = (function () {
        /**
         * A base class for game states.  Basically just an interface with callbacks
         * for updating and rendering, along with other lifecycle-ish methods.
         *
         * @constructor
         */
        function State(args) {
            if (args instanceof gtp.Game) {
                this.game = args;
            }
            else if (args) {
                this.game = args.game;
            }
            else {
                this.game = window.game;
            }
        }
        /**
         * Called right before a state starts.  Subclasses can do any needed
         * initialization here.
         */
        State.prototype.init = function () {
            // Subclasses can override
        };
        /**
         * Called when this state is being left for another one.
         */
        State.prototype.leaving = function (game) {
        };
        /**
         * Subclasses should override this method to do necessary update logic.
         *
         * @param {float} delta The amount of time that has elapsed since the last
         *        frame/call to this method.
         */
        State.prototype.update = function (delta) {
            // Subclasses should override
        };
        /**
         * Subclasses should override this method to render the screen.
         *
         * @param {CanvasRenderingContext2D} ctx The graphics context to render onto.
         */
        State.prototype.render = function (ctx) {
            // Subclasses should override
        };
        return State;
    })();
    gtp.State = State;
})(gtp || (gtp = {}));

//# sourceMappingURL=State.js.map