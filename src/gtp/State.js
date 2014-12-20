var gtp = gtp || {};

/**
 * A base class for game states.  Basically just an interface with callbacks
 * for updating and rendering, along with other lifecycle-ish methods.
 * 
 * @constructor
 */
gtp.State = function(game) {
   'use strict';
   this.game = game || window.game;
};

gtp.State.prototype = {
   
   /**
    * Called right before a state starts.  Subclasses can do any needed
    * initialization here.
    */
   init: function() {
      // Subclasses can override
   },
   
   /**
    * Called when this state is being left for another one.
    */
   leaving: function(game) {
   },
   
   /**
    * Subclasses should override this method to do necessary update logic.
    * 
    * @param {float} delta The amount of time that has elapsed since the last
    *        frame/call to this method.
    */
   update: function(delta) {
      // Subclasses should override
   },
   
   /**
    * Subclasses should override this method to render the screen.
    * 
    * @param {CanvasContext2D} ctx The graphics context to render onto.
    */
   render: function(ctx) {
      // Subclasses should override
   }
   
};
