var gtp = gtp || {};

/**
 * A base class for a game.
 *
 * @constructor
 */
gtp.Game = function(args) {
   
   gtp.Utils.initConsole();
   
   args = args || {};
   this._scale = args.scale || 1;
   this.canvas = gtp.ImageUtils.createCanvas(args.width, args.height, args.parent);
   
   this.inputManager = new gtp.InputManager();
   this.inputManager.install();
   this._gameTime = 0;
   this._targetFps = arguments.targetFps || 30;
   this._interval = 1000 / this._targetFps;
   this.lastTime = null;
   
   this.audio = new gtp.AudioSystem();
   this.audio.init();
   this.assets = new gtp.AssetLoader(this._scale, this.audio);
   
   this.clearScreenColor = 'rgb(0,0,0)';
   
   this.fpsColor = 'rgb(255,255,255)';
   this.statusMessageRGB = '255,255,255';
   this._statusMessageColor = null;
   this.showFps = true;
   this.frames = 0;
   this._fpsMsg = this._targetFps + ' fps';
   this._statusMessage = null;
   this._statusMessageAlpha = 0;
   
   this.timer = new gtp.Timer();
};

gtp.Game.prototype = {
   
   /**
    * Starts the game loop.
    */
   start: function() {
      // e.g. Dojo's lang.hitch()
      var self = this;
      var callback = function() {
         self._gameTime += self._interval;
         self._tick.apply(self);
      };
      setInterval(callback, this._interval);
   },
   
   _tick: function() {
      
      if (this._statusMessage) {
         var time = new Date().getTime();
         if (time > this._statusMessageTime) {
            this._statusMessageTime = time + 100;
            this._statusMessageAlpha -= 0.1;
            var alpha = Math.min(1, this._statusMessageAlpha);
            this._statusMessageColor = 'rgba(' + this.statusMessageRGB + ',' + alpha + ')';
            if (this._statusMessageAlpha <= 0) {
               this._statusMessage = null;
            }
         }
      }
      
      this.update();
      this.render();
   },
   
   /**
    * Called during each tick to update game logic.  The default implementation
    * checks for a shortcut key to toggle the FPS display before delegating to
    * the current game state.  Subclasses can override, but typically update
    * logic is handled by game states.
    */
   update: function() {
      
      var im = this.inputManager;
      if (im.isKeyDown(gtp.Keys.SHIFT)) {
         
         if (im.isKeyDown(gtp.Keys.F, true)) {
            game.toggleShowFps();
         }
         
      }
      this.state.update(this._interval);
      
   },
   
   render: function() {
      
      var ctx = this.canvas.getContext('2d');
      this.state.render(ctx);
      
      if (this.showFps) {
         this._renderFps(ctx);
      }
      if (this._statusMessage && this._statusMessageAlpha>0) {
         this._renderStatusMessage(ctx);
      }
   },
   
   getHeight: function() {
      return this.canvas.height;
   },
   
   getWidth: function() {
      return this.canvas.width;
   },
   
   randomInt: function(max) {
      var min = 0;
      // Using Math.round() would give a non-uniform distribution!
      return Math.floor(Math.random() * (max - min + 1) + min);
   },
   
   setState: function(state) {
      if (this.state) {
         this.state.leaving(this);
      }
      this.state = state;
      this.state.init(this);
   },
   
   _renderStatusMessage: function(ctx) {
      var x = 10;
      var y = this.canvas.height -30;
      ctx.font = 'Dragon Warrior 2';//'10pt Arial';
      ctx.fillStyle = this._statusMessageColor;
      ctx.fillText(this._statusMessage, x, y);
   },
   
   _renderFps: function(ctx) {
      
      this.frames++;
      var now = new Date().getTime();
      if (this.lastTime===null) {
         this.lastTime = now;
      }
      else if (now-this.lastTime>=1000) {
         this._fpsMsg = this.frames + ' fps';
         this.frames = 0;
         this.lastTime = now;
      }
      
      var x = 10;
      var y = 15;
      ctx.font = '10pt Arial';
      ctx.fillStyle = this.fpsColor;
      ctx.fillText(this._fpsMsg, x, y);
      
   },
   
   setStatusMessage: function(message) {
      this._statusMessage = message;
      this._statusMessageAlpha = 2.0; // 1.0 of message, 1.0 of fading out
      this._statusMessageTime = new Date().getTime() + 100;
   },
   
   toggleShowFps: function() {
      this.showFps = !this.showFps;
      this.setStatusMessage('FPS display: ' + (this.showFps ? 'on' : 'off'));
   },
   
   clearScreen: function(clearScreenColor) {
      var color = clearScreenColor || this.clearScreenColor;
      var ctx = this.canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0,0, this.getWidth(), this.getHeight());
   }
   
};
