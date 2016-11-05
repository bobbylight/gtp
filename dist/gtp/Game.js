var gtp;
(function (gtp) {
    'use strict';
    /**
     * A base class for a game.
     *
     * @constructor
     */
    var Game = (function () {
        function Game(args) {
            if (args === void 0) { args = {}; }
            gtp.Utils.initConsole();
            this._scale = args.scale || 1;
            this.canvas = gtp.ImageUtils.createCanvas(args.width, args.height, args.parent);
            this.inputManager = new gtp.InputManager(args.keyRefreshMillis || 0);
            this.inputManager.install();
            this._targetFps = args.targetFps || 30;
            this._interval = 1000 / this._targetFps;
            this.lastTime = 0;
            this.audio = new gtp.AudioSystem();
            this.audio.init();
            var assetPrefix = args.assetRoot || null;
            this.assets = new gtp.AssetLoader(this._scale, this.audio, assetPrefix);
            this.clearScreenColor = 'rgb(0,0,0)';
            this.fpsColor = 'rgb(255,255,255)';
            this.statusMessageRGB = '255,255,255';
            this._statusMessageColor = null;
            this.showFps = false;
            this.frames = 0;
            this._fpsMsg = this._targetFps + ' fps';
            this._statusMessage = null;
            this._statusMessageAlpha = 0;
            this._gameTimer = new gtp._GameTimer();
            this.timer = new gtp.Timer();
        }
        /**
         * Clears the screen.
         * @param {string} clearScreenColor The color to clear the screen with.
         *        If unspecified, <code>this.clearScreenColor</code> is used.
         */
        Game.prototype.clearScreen = function (clearScreenColor) {
            if (clearScreenColor === void 0) { clearScreenColor = this.clearScreenColor; }
            var ctx = this.canvas.getContext('2d');
            ctx.fillStyle = clearScreenColor;
            ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
        };
        Game.prototype.getHeight = function () {
            return this.canvas.height;
        };
        Game.prototype.getWidth = function () {
            return this.canvas.width;
        };
        Object.defineProperty(Game.prototype, "paused", {
            /**
             * Returns whether this game is paused.
             * @return {boolean} Whether this game is paused.
             */
            get: function () {
                return this._gameTimer.paused;
            },
            /**
             * Sets whether the game is paused.  The game is still told to handle
             * input, update itself and render.  This is simply a flag that should
             * be set whenever a "pause" screen is displayed.  It stops the "in-game
             * timer" until the game is unpaused.
             *
             * @param paused Whether the game should be paused.
             */
            set: function (paused) {
                if (paused) {
                    this.audio.pauseAll();
                }
                else {
                    this.audio.resumeAll();
                }
                this._gameTimer.paused = paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "playTime", {
            /**
             * Returns the length of time the game has been played so far.  This is
             * "playable time;" that is, time in which the user is playing, and the
             * game is not paused or in a "not updating" state (such as the main
             * frame not having focus).
             *
             * @return The amount of time the game has been played, in milliseconds.
             * @see resetPlayTime
             */
            get: function () {
                return this._gameTimer.playTime;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns a random number between <code>0</code> and
         * <code>number</code>, exclusive.
         *
         * @param max {number} The upper bound, exclusive.
         * @return {number} The random number.
         */
        Game.prototype.randomInt = function (max) {
            var min = 0;
            // Using Math.round() would give a non-uniform distribution!
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        Game.prototype.render = function () {
            var ctx = this.canvas.getContext('2d');
            this.state.render(ctx);
            if (this.showFps) {
                this._renderFps(ctx);
            }
            if (this._statusMessage && this._statusMessageAlpha > 0) {
                this._renderStatusMessage(ctx);
            }
        };
        Game.prototype._renderFps = function (ctx) {
            this.frames++;
            var now = gtp.Utils.timestamp();
            if (this.lastTime === null) {
                this.lastTime = now;
            }
            else if (now - this.lastTime >= 1000) {
                this._fpsMsg = this.frames + ' fps';
                this.frames = 0;
                this.lastTime = now;
            }
            var x = 10;
            var y = 15;
            ctx.font = '10pt Arial';
            ctx.fillStyle = this.fpsColor;
            ctx.fillText(this._fpsMsg, x, y);
        };
        Game.prototype._renderStatusMessage = function (ctx) {
            if (this._statusMessage) {
                var x = 10;
                var y = this.canvas.height - 6;
                ctx.font = '10pt Arial';
                ctx.fillStyle = this._statusMessageColor || '#fff';
                ctx.fillText(this._statusMessage, x, y);
            }
        };
        /**
         * Resets the "playtime in milliseconds" timer back to <code>0</code>.
         *
         * @see playTimeMillis
         */
        Game.prototype.resetPlayTime = function () {
            this._gameTimer.resetPlayTime();
        };
        Game.prototype.setState = function (state) {
            if (this.state) {
                this.state.leaving(this);
            }
            this.state = state;
            this.state.enter(this);
        };
        Game.prototype.setStatusMessage = function (message) {
            this._statusMessage = message;
            this._statusMessageAlpha = 2.0; // 1.0 of message, 1.0 of fading out
            this._statusMessageTime = gtp.Utils.timestamp() + 100;
        };
        /**
         * Starts the game loop.
         */
        Game.prototype.start = function () {
            var callback = gtp.Utils.hitch(this, this._tick);
            this._gameTimer.start();
            setInterval(callback, this._interval);
        };
        Game.prototype._tick = function () {
            if (this._statusMessage) {
                var time = gtp.Utils.timestamp();
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
        };
        Game.prototype.toggleMuted = function () {
            var muted = this.audio.toggleMuted();
            this.setStatusMessage(muted ? 'Audio muted' : 'Audio enabled');
            return muted;
        };
        Game.prototype.toggleShowFps = function () {
            this.showFps = !this.showFps;
            this.setStatusMessage('FPS display: ' + (this.showFps ? 'on' : 'off'));
        };
        /**
         * Called during each tick to update game logic.  The default implementation
         * checks for a shortcut key to toggle the FPS display before delegating to
         * the current game state.  Subclasses can override, but typically update
         * logic is handled by game states.
         */
        Game.prototype.update = function () {
            var im = this.inputManager;
            if (im.isKeyDown(gtp.Keys.KEY_SHIFT)) {
                if (im.isKeyDown(gtp.Keys.KEY_F, true)) {
                    this.toggleShowFps();
                }
            }
            this.state.update(this._interval);
        };
        return Game;
    }());
    gtp.Game = Game;
})(gtp || (gtp = {}));

//# sourceMappingURL=Game.js.map
