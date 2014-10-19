var gtp = gtp || {};

gtp.State = function() {
   
};

gtp.State.prototype = {
   
   init: function(game) {
      'use strict';
      this.game = game;
   },
   
   leaving: function(game) {
   },
   
   update: function(delta) {
      // Subclasses should override
   },
   
   render: function(ctx) {
      // Subclasses should override
   }
   
};