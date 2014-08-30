/**
 * Fades one state out and another state in.
 */
function FadeOutInState(leavingState, enteringState, transitionLogic, timeMillis) {
   'use strict';
   this._leavingState = leavingState;
   this._enteringState = enteringState;
   this._transitionLogic = transitionLogic;
   this._fadingOut = true;
   this._alpha = 1;
   this._halfTime = timeMillis && timeMillis>0 ? timeMillis/2 : 800;
   this._curTime = 0;
}

FadeOutInState.prototype = Object.create(gtp.State.prototype, {
   
   update: {
      value: function(delta) {
         'use strict';
         
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
               game.setState(this._enteringState);
               return;
            }
         }
         
         var state;
         if (this._fadingOut) {
            this._alpha = 1 - (this._curTime / this._halfTime);
            state = this._leavingState;
         }
         else {
            this._alpha = (this._curTime / this._halfTime);
            state = this._enteringState;
         }
      }
   },
   
   render: {
      value: function(ctx) {
         'use strict';
         
         var game = this.game;
         game.clearScreen();
         
         var previousAlpha = ctx.globalAlpha;
         ctx.globalAlpha = this._alpha;
         if (this._fadingOut) {
            this._leavingState.render(ctx);
         }
         else {
            this._enteringState.render(ctx);
         }
         ctx.globalAlpha = previousAlpha;
      }
   }
   
});

FadeOutInState.prototype.constructor = FadeOutInState;
