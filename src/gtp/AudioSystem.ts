import Sound from './Sound';
import { Window } from './GtpBase';
import { SoundCompletedCallback } from './SoundCompletedCallback';

interface _PlayingSoundConfig {
	audioSystem: AudioSystem;
	id: number;
	soundId: string;
	loop: boolean;
	buffer: AudioBuffer;
	connectTo: AudioNode|AudioNode[];
	onendedGenerator: Function;
	startOffset?: number;
}

/**
 * A sound effect that is currently being played.
 */
class PlayingSound {

	id: number;
	soundId: string;
	source: AudioBufferSourceNode;
	_config: _PlayingSoundConfig;
	_startOffset: number;
	_paused: boolean;
	_start: number;
	_playedTime: number;

	constructor(config: _PlayingSoundConfig) {
		this._config = config;
		this._paused = false;
	}

	private _initFromConfig() {

		this.id = this._config.id;
		this.soundId = this._config.soundId;

		this.source = this._config.audioSystem.context.createBufferSource();
		this.source.loop = this._config.loop;
		this.source.buffer = this._config.buffer;
		if (this._config.connectTo instanceof AudioNode) {
			this.source.connect(<AudioNode>this._config.connectTo);
		}
		else {
			let nodes: AudioNode[] = <AudioNode[]>this._config.connectTo;
			nodes.forEach((node: AudioNode) => {
				this.source.connect(node);
			});
		}

		this._startOffset = this._config.startOffset || 0;

		if (!this._config.loop) {
			this.source.onended = this._config.onendedGenerator(this.id);
		}
	}

	pause() {
		if (!this._paused) {
			this.source.stop();
			this._playedTime += this.source.context.currentTime - this._start;
			this._paused = true;
			this._start = 0;
		}
	}

	resume() {
		if (this._paused) {
			this._paused = false;
			let prevStartOffset: number = this._startOffset;
			this._initFromConfig();
			this._startOffset = prevStartOffset + this._playedTime;
			this._startOffset = this._startOffset % this.source.buffer!.duration;
			let curAudioTime: number = this.source.context.currentTime;
			this.source.start(curAudioTime, this._startOffset);
			this._start = curAudioTime;
			this._playedTime = 0;
		}
	}

	start() {
		this._paused = false;
		this._initFromConfig();
		let curAudioTime: number = this.source.context.currentTime;
		this.source.start(curAudioTime, this._startOffset);
		this._start = curAudioTime;
		this._playedTime = 0;
	}

}

export default class AudioSystem {

	private _currentMusic: AudioBufferSourceNode | null;
	private _sounds: { [id: string]: Sound };
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
	 * A list of all sound effects currently being played.  If a sound effect
	 * is not looping (which is likely typical), it will be removed from this
	 * list when it completes.  This data structure allows us to pause all sound
	 * effects at the same time.
	 */
	private _playingSounds: PlayingSound[];

	/**
	 * Used to give all playing sound effects unique ids.
	 */
	private _soundEffectIdGenerator: number;

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
		this._playingSounds = [];
		this._soundEffectIdGenerator = 0;
	}

	private _createPlayingSound(id: string, loop: boolean = false,
			startOffset: number = 0, doneCallback?: SoundCompletedCallback): PlayingSound {

		const soundEffectId: number = this._createSoundEffectId();

		const soundEffect: PlayingSound = new PlayingSound({
			audioSystem: this,
			buffer: this._sounds[id].getBuffer(),
			connectTo: this._volumeFaderGain,
			id: soundEffectId,
			loop: loop,
			onendedGenerator: (playingSoundId: number) => {
				return () => {
					this._removePlayingSound(playingSoundId);
					if (doneCallback) {
						doneCallback(soundEffectId, id);
					}
				};
			},
			soundId: id,
			startOffset: startOffset,
		});
		return soundEffect;
	}

	private _createSoundEffectId(): number {
		return this._soundEffectIdGenerator++;
	}

	/**
	 * Initializes the audio system.
	 */
	init() {

		// Effectively cast to our window extension for static typing
		const w: Window = <any>window;

		try {
			w.AudioContext = w.AudioContext || w.webkitAudioContext;
			this.context = new w.AudioContext();
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
	 * @param sound {Sound} The sound.
	 */
	addSound(sound: Sound) {
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
				setTimeout(() => {
					this.playMusic(newMusicId);
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
	 * @see playMusic
	 * @see stopMusic
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
	 * Pauses all music and sound effects.
	 * @see resumeAll
	 */
	pauseAll() {
		this._playingSounds.forEach((sound: PlayingSound) => {
			sound.pause();
		});
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
	playMusic(id: string, loop: boolean = false) {

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
			const sound: Sound = this._sounds[id];
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
			this._currentMusic.loopEnd = this._currentMusic.buffer!.duration;
			this._currentMusic.connect(this._musicFaderGain);
			this._musicFaderGain.connect(this._volumeFaderGain);
			this._currentMusic.start(0);
			this.currentMusicId = id;
			console.log(`Just started new music with id: ${id}, loop: ${loop}`);

		}

	}

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
	playSound(id: string, loop: boolean = false, doneCallback?: SoundCompletedCallback): number {
		if (this.context) {

			let playingSound: PlayingSound = this._createPlayingSound(id, loop, 0, doneCallback);
			this._playingSounds.push(playingSound);
			playingSound.start();
			return playingSound.id;
		}

		return -1;
	}

	/**
	 * Removes a sound from our list of currently-being-played sound effects.
	 * @param {number} id The sound effect to stop playing.
	 * @return The sound just removed, or <code>null</code> if there was no such sound.
	 */
	private _removePlayingSound(id: number): PlayingSound | null {
		for (let i: number = 0; i < this._playingSounds.length; i++) {
			if (this._playingSounds[i].id === id) {
				let sound: PlayingSound = this._playingSounds[i];
				this._playingSounds.splice(i, 1);
				return sound;
			}
		}
		return null;
	}

	/**
	 * Resumes all music and sound effects.
	 * @see pauseAll
	 */
	resumeAll() {

		for (let i: number = 0; i < this._playingSounds.length; i++) {
			let sound: PlayingSound = this._playingSounds[i];
			if (sound._paused) {
				sound.resume();
			}
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
		if (this._currentMusic) {
			this._currentMusic.stop();
			if (!pause) {
				this._currentMusic.disconnect();
				this._musicFaderGain.disconnect();
				delete this._currentMusic;
				delete this._musicFaderGain;
			}
		}
	}

	/**
	 * Stops a playing sound, by ID.
	 * @param {number} id The sound effect to stop.
	 * @return {boolean} Whether the sound effect was stopped.  This will be
	 *         <code>false</code> if the sound effect specified is no longer
	 *         playing.
	 * @see playSound
	 */
	stopSound(id: number): boolean {
		const sound: PlayingSound | null = this._removePlayingSound(id);
		if (sound) {
			sound.source.stop();
			return true;
		}
		return false;
	}

	toggleMuted(): boolean {
		this._muted = !this._muted;
		if (this.context) {
			const initialValue: number = this._muted ? 0 : 1;
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
