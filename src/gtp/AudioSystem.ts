module gtp {
	'use strict';
	export class AudioSystem {

		private _currentMusic: AudioBufferSourceNode;
		private _sounds: { [id: string]: gtp.Sound };
		private _musicFade: number;
		private _fadeMusic: boolean;
		private _muted: boolean;
		private _initialized: boolean;

		context: AudioContext;
		private _volumeFaderGain: GainNode;
		private _musicFaderGain: GainNode;
		private currentMusicId: string;
		private _musicLoopStart: number;

		/**
		 * A wrapper around web audio for games.
		 * 
		 * @constructor
		 */
		constructor() {
			this._currentMusic = null;
			this._sounds = {};
			this._musicFade = 0.3; // seconds
			this._fadeMusic = true;
			this._muted = false;
		}

		/**
		 * Initializes the audio system.
		 */
		init() {
			try {
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				this.context = new window.AudioContext();
				this._volumeFaderGain = this.context.createGain();
				this._volumeFaderGain.gain.setValueAtTime(1, this.context.currentTime);
				this._volumeFaderGain.gain.value = 1;
				this._volumeFaderGain.connect(this.context.destination);
				this._initialized = true;
			} catch (e) {
				console.error('The Web Audio API is not supported in this browser.');
				this._initialized = false;
			}
		}
   
		/**
		 * Registers a sound for later playback.
		 * @param sound {gtp.Sound} The sound.
		 */
		addSound(sound: gtp.Sound) {
			if (this.context) {
				this._sounds[sound.getId()] = sound;
			}
		}
   
		fadeOutMusic(newMusicId: string) {

			if (this.context) {
				if (this._currentMusic) {
					if (!this._muted) {
						// We must "anchor" via setValueAtTime() before calling a *rampToValue() method (???)
						this._musicFaderGain.gain.setValueAtTime(this._musicFaderGain.gain.value, this.context.currentTime);
						this._musicFaderGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this._musicFade);
					}
					var that: AudioSystem = this;
					setTimeout(function() {
						that.playMusic(newMusicId);
					}, this._musicFade * 1000);
				}
				else {
					this.playMusic(newMusicId);
				}
			}
		}
   
		/**
		 * Returns the ID of the current music being played.
		 * 
		 * @return {string} The current music's ID.
		 */
		getCurrentMusic(): string {
			return this.currentMusicId;
		}
   
		/**
		 * Returns whether the audio system initialized properly.  This will return
		 * false if the user's browser does not support the web audio API.
		 * @return {boolean} Whether the sound system is initialized
		 */
		isInitialized(): boolean {
			return this._initialized;
		}
   
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
		playMusic(id: string, loop?: boolean) {

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
				var sound: Sound = this._sounds[id];
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

		}
   
		/**
		 * Plays the sound with the given ID.
		 * @param {string} id The ID of the resource to play.
		 */
		playSound(id: string) {
			if (this.context) {
				var source: AudioBufferSourceNode = this.context.createBufferSource();
				source.buffer = this._sounds[id].getBuffer();
				source.connect(this._volumeFaderGain);
				source.start(0);
			}
		}
   
		/**
		 * Stops the currently playing music, if any.
		 * @param {boolean} pause If <code>true</code>, the music is only paused;
		 *        otherwise, native resources are freed and the music cannot be
		 *        resumed.
		 * @see playMusic
		 */
		stopMusic(pause: boolean = false) {
			this._currentMusic.stop();
			if (!pause) {
				this._currentMusic.disconnect();
				this._musicFaderGain.disconnect();
				delete this._currentMusic;
				delete this._musicFaderGain;
			}
		}
   
		toggleMuted(): boolean {
			this._muted = !this._muted;
			if (this.context) {
				var initialValue: number = this._muted ? 0 : 1;
				this._volumeFaderGain.gain.setValueAtTime(initialValue, this.context.currentTime);
				this._volumeFaderGain.gain.value = initialValue;
			}
			return this._muted;
		}
   
		get fadeMusic(): boolean {
			'use strict';
			return this._fadeMusic;
		}
   
		set fadeMusic(fade: boolean) {
			this._fadeMusic = fade;
		}
   
		get musicFadeSeconds(): number {
			return this._musicFade;
		}
   
		set musicFadeSeconds(seconds: number) {
			this._musicFade = seconds;
		}
	}
}