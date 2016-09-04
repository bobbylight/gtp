var gtp;
(function (gtp) {
    'use strict';
    /**
     * A sound effect that is currently being played.
     */
    var PlayingSound = (function () {
        function PlayingSound(config) {
            this._config = config;
            this._paused = false;
        }
        PlayingSound.prototype._initFromConfig = function () {
            var _this = this;
            this.id = this._config.id;
            this.soundId = this._config.soundId;
            this.source = this._config.audioSystem.context.createBufferSource();
            this.source.loop = this._config.loop;
            this.source.buffer = this._config.buffer;
            if (this._config.connectTo instanceof AudioNode) {
                this.source.connect(this._config.connectTo);
            }
            else {
                var nodes = this._config.connectTo;
                nodes.forEach(function (node) {
                    _this.source.connect(node);
                });
            }
            this._startOffset = this._config.startOffset || 0;
            if (!this._config.loop) {
                var self_1 = this;
                var audioSystem = this._config.audioSystem;
                this.source.onended = this._config.onendedGenerator(self_1.id);
            }
        };
        PlayingSound.prototype.pause = function () {
            if (!this._paused) {
                this.source.stop();
                this._playedTime += this.source.context.currentTime - this._start;
                this._paused = true;
                this._start = 0;
            }
        };
        PlayingSound.prototype.resume = function () {
            if (this._paused) {
                this._paused = false;
                var prevStartOffset = this._startOffset;
                this._initFromConfig();
                this._startOffset = prevStartOffset + this._playedTime;
                this._startOffset = this._startOffset % this.source.buffer.duration;
                var curAudioTime = this.source.context.currentTime;
                this.source.start(curAudioTime, this._startOffset);
                this._start = curAudioTime;
                this._playedTime = 0;
            }
        };
        PlayingSound.prototype.start = function () {
            this._paused = false;
            this._initFromConfig();
            var curAudioTime = this.source.context.currentTime;
            this.source.start(curAudioTime, this._startOffset);
            this._start = curAudioTime;
            this._playedTime = 0;
        };
        return PlayingSound;
    }());
    var AudioSystem = (function () {
        /**
         * A wrapper around web audio for games.
         *
         * @constructor
         */
        function AudioSystem() {
            this._currentMusic = null;
            this._sounds = {};
            this._musicFade = 0.3; // seconds
            this._fadeMusic = true;
            this._muted = false;
            this._playingSounds = [];
            this._soundEffectIdGenerator = 0;
        }
        AudioSystem.prototype._createPlayingSound = function (id, loop, startOffset, doneCallback) {
            if (loop === void 0) { loop = false; }
            if (startOffset === void 0) { startOffset = 0; }
            if (doneCallback === void 0) { doneCallback = null; }
            var self = this;
            var soundEffectId = this._createSoundEffectId();
            var soundEffect = new PlayingSound({
                audioSystem: this,
                buffer: this._sounds[id].getBuffer(),
                connectTo: this._volumeFaderGain,
                id: soundEffectId,
                loop: loop,
                onendedGenerator: function (playingSoundId) {
                    return function () {
                        self._removePlayingSound(playingSoundId);
                        if (doneCallback) {
                            doneCallback(soundEffectId, id);
                        }
                    };
                },
                soundId: id,
                startOffset: startOffset,
            });
            return soundEffect;
        };
        AudioSystem.prototype._createSoundEffectId = function () {
            return this._soundEffectIdGenerator++;
        };
        /**
         * Initializes the audio system.
         */
        AudioSystem.prototype.init = function () {
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new window.AudioContext();
                this._volumeFaderGain = this.context.createGain();
                this._volumeFaderGain.gain.setValueAtTime(1, this.context.currentTime);
                this._volumeFaderGain.gain.value = 1;
                this._volumeFaderGain.connect(this.context.destination);
                this._initialized = true;
            }
            catch (e) {
                console.error('The Web Audio API is not supported in this browser.');
                this._initialized = false;
            }
        };
        /**
         * Registers a sound for later playback.
         * @param sound {gtp.Sound} The sound.
         */
        AudioSystem.prototype.addSound = function (sound) {
            if (this.context) {
                this._sounds[sound.getId()] = sound;
            }
        };
        AudioSystem.prototype.fadeOutMusic = function (newMusicId) {
            if (this.context) {
                if (this._currentMusic) {
                    if (!this._muted) {
                        // We must "anchor" via setValueAtTime() before calling a *rampToValue() method (???)
                        this._musicFaderGain.gain.setValueAtTime(this._musicFaderGain.gain.value, this.context.currentTime);
                        this._musicFaderGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this._musicFade);
                    }
                    var that = this;
                    setTimeout(function () {
                        that.playMusic(newMusicId);
                    }, this._musicFade * 1000);
                }
                else {
                    this.playMusic(newMusicId);
                }
            }
        };
        /**
         * Returns the ID of the current music being played.
         *
         * @return {string} The current music's ID.
         * @see playMusic
         * @see stopMusic
         */
        AudioSystem.prototype.getCurrentMusic = function () {
            return this.currentMusicId;
        };
        /**
         * Returns whether the audio system initialized properly.  This will return
         * false if the user's browser does not support the web audio API.
         * @return {boolean} Whether the sound system is initialized
         */
        AudioSystem.prototype.isInitialized = function () {
            return this._initialized;
        };
        /**
         * Pauses all music and sound effects.
         * @see resumeAll
         */
        AudioSystem.prototype.pauseAll = function () {
            this._playingSounds.forEach(function (sound) {
                sound.pause();
            });
        };
        /**
         * Plays a specific sound as background music.  Only one "music" can play
         * at a time, as opposed to "sounds," of which multiple can be playing at
         * one time.
         * @param {string} id The ID of the resource to play as music.  If this is
         *        <code>null</code>, the current music is stopped but no new music
         *        is started.
         * @param {boolean} loop Whether the music should loop.
         * @see stopMusic
         */
        AudioSystem.prototype.playMusic = function (id, loop) {
            if (this.context) {
                // Note: We destroy and recreate _musicFaderGain each time, because
                // it appears to occasionally start playing muted if we do not do
                // so, even when gain.value===1, on Chrome 38.
                if (this._currentMusic) {
                    this.stopMusic(false);
                }
                if (!id) {
                    return; // null id => don't play any music
                }
                var sound = this._sounds[id];
                if (typeof loop === 'undefined') {
                    loop = sound.getLoopsByDefaultIfMusic();
                }
                this._musicFaderGain = this.context.createGain();
                this._musicFaderGain.gain.setValueAtTime(1, this.context.currentTime);
                this._musicFaderGain.gain.value = 1;
                this._currentMusic = this.context.createBufferSource();
                this._currentMusic.loop = loop;
                this._musicLoopStart = sound.getLoopStart() || 0;
                this._currentMusic.loopStart = this._musicLoopStart;
                this._currentMusic.buffer = sound.getBuffer();
                this._currentMusic.loopEnd = this._currentMusic.buffer.duration;
                this._currentMusic.connect(this._musicFaderGain);
                this._musicFaderGain.connect(this._volumeFaderGain);
                this._currentMusic.start(0);
                this.currentMusicId = id;
                console.log('Just started new music with id: ' + id + ', loop: ' + loop);
            }
        };
        /**
         * Plays the sound with the given ID.
         * @param {string} id The ID of the resource to play.
         * @param {boolean} loop Whether the music should loop.  Defaults to
         *        <code>false</code>.
         * @param {Function} doneCallback An optional callback to call when the
         *        sound completes. This callback will receive the returned numeric
         *        ID as a parameter.  This parameter is ignored if <code>loop</code>
         *        is <code>true</code>.
         * @return {number} An ID for the playing sound.  This can be used to
         *         stop a looping sound via <code>stopSound(id)</code>.
         * @see stopSound
         */
        AudioSystem.prototype.playSound = function (id, loop, doneCallback) {
            if (loop === void 0) { loop = false; }
            if (doneCallback === void 0) { doneCallback = null; }
            if (this.context) {
                var playingSound = this._createPlayingSound(id, loop, 0, doneCallback);
                this._playingSounds.push(playingSound);
                playingSound.start();
                return playingSound.id;
            }
            return -1;
        };
        /**
         * Removes a sound from our list of currently-being-played sound effects.
         * @param {gtp.PlayingSound} playingSound The sound effect to stop playing.
         * @return The sound just removed.
         */
        AudioSystem.prototype._removePlayingSound = function (id) {
            for (var i = 0; i < this._playingSounds.length; i++) {
                if (this._playingSounds[i].id === id) {
                    var sound = this._playingSounds[i];
                    this._playingSounds.splice(i, 1);
                    return sound;
                }
            }
            return null;
        };
        /**
         * Resumes all music and sound effects.
         * @see pauseAll
         */
        AudioSystem.prototype.resumeAll = function () {
            for (var i = 0; i < this._playingSounds.length; i++) {
                var sound = this._playingSounds[i];
                if (sound._paused) {
                    sound.resume();
                }
            }
        };
        /**
         * Stops the currently playing music, if any.
         * @param {boolean} pause If <code>true</code>, the music is only paused;
         *        otherwise, native resources are freed and the music cannot be
         *        resumed.
         * @see playMusic
         */
        AudioSystem.prototype.stopMusic = function (pause) {
            if (pause === void 0) { pause = false; }
            this._currentMusic.stop();
            if (!pause) {
                this._currentMusic.disconnect();
                this._musicFaderGain.disconnect();
                delete this._currentMusic;
                delete this._musicFaderGain;
            }
        };
        /**
         * Stops a playing sound, by ID.
         * @param {number} id The sound effect to stop.
         * @return {boolean} Whether the sound effect was stopped.  This will be
         *         <code>false</code> if the sound effect specified is no longer
         *         playing.
         * @see playSound
         */
        AudioSystem.prototype.stopSound = function (id) {
            var sound = this._removePlayingSound(id);
            if (sound) {
                sound.source.stop();
                return true;
            }
            return false;
        };
        AudioSystem.prototype.toggleMuted = function () {
            this._muted = !this._muted;
            if (this.context) {
                var initialValue = this._muted ? 0 : 1;
                this._volumeFaderGain.gain.setValueAtTime(initialValue, this.context.currentTime);
                this._volumeFaderGain.gain.value = initialValue;
            }
            return this._muted;
        };
        Object.defineProperty(AudioSystem.prototype, "fadeMusic", {
            get: function () {
                'use strict';
                return this._fadeMusic;
            },
            set: function (fade) {
                this._fadeMusic = fade;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AudioSystem.prototype, "musicFadeSeconds", {
            get: function () {
                return this._musicFade;
            },
            set: function (seconds) {
                this._musicFade = seconds;
            },
            enumerable: true,
            configurable: true
        });
        return AudioSystem;
    }());
    gtp.AudioSystem = AudioSystem;
})(gtp || (gtp = {}));

//# sourceMappingURL=AudioSystem.js.map
