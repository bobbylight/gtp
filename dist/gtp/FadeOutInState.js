var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gtp;
(function (gtp) {
    'use strict';
    var FadeOutInState = (function (_super) {
        __extends(FadeOutInState, _super);
        /**
         * Fades one state out and another state in.
         *
         * @constructor
         */
        function FadeOutInState(leavingState, enteringState, transitionLogic, timeMillis) {
            _super.call(this);
            this._leavingState = leavingState;
            this._enteringState = enteringState;
            this._transitionLogic = transitionLogic;
            this._fadingOut = true;
            this._alpha = 1;
            this._halfTime = timeMillis && timeMillis > 0 ? timeMillis / 2 : 800;
            this._curTime = 0;
        }
        FadeOutInState.prototype.update = function (delta) {
            _super.prototype.update.call(this, delta);
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
            if (this._fadingOut) {
                this._alpha = 1 - (this._curTime / this._halfTime);
            }
            else {
                this._alpha = (this._curTime / this._halfTime);
            }
        };
        FadeOutInState.prototype.render = function (ctx) {
            _super.prototype.render.call(this, ctx);
            this.game.clearScreen();
            var previousAlpha = ctx.globalAlpha;
            ctx.globalAlpha = this._alpha;
            if (this._fadingOut) {
                this._leavingState.render(ctx);
            }
            else {
                this._enteringState.render(ctx);
            }
            ctx.globalAlpha = previousAlpha;
        };
        /**
         * Sets the new game state.  This is a hook for subclasses to perform
         * extra logic.
         *
         * @param state The new state.
         */
        FadeOutInState.prototype._setState = function (state) {
            this.game.setState(this._enteringState);
        };
        return FadeOutInState;
    }(gtp.State));
    gtp.FadeOutInState = FadeOutInState;
})(gtp || (gtp = {}));

//# sourceMappingURL=FadeOutInState.js.map
