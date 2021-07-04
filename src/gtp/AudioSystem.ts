import Sound from './Sound';
import { Window } from './GtpBase';
import { SoundCompletedCallback } from './SoundCompletedCallback';

/**
 * Configuration for a playing sound.
 */
interface PlayingSoundConfig {
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
	soundId?: string;
	source?: AudioBufferSourceNode;
	private readonly config: PlayingSoundConfig;
	private startOffset: number;
	private paused: boolean;
	private startTime: number;
	private playedTime: number;

	constructor(config: PlayingSoundConfig) {
		this.config = config;
		this.id = -1;
		this.soundId = undefined;
		this.source = undefined;
		this.paused = false;
		this.startOffset = -1;
		this.startTime = -1;
		this.playedTime = 0;
	}

	/**
	 * We delay setting up the audio resources until the first time this sound is played as a
	 * micro-optimization.
	 */
	private initFromConfig() {

		this.id = this.config.id;
		this.soundId = this.config.soundId;

		this.source = this.config.audioSystem.context.createBufferSource();
		this.source.loop = this.config.loop;
		this.source.buffer = this.config.buffer;
		if (this.config.connectTo instanceof AudioNode) {
			this.source.connect(this.config.connectTo);
		}
		else {
			const nodes: AudioNode[] = this.config.connectTo;
			nodes.forEach((node: AudioNode) => {
				this.source!.connect(node);
			});
		}

		this.startOffset = this.config.startOffset || 0;

		if (!this.config.loop) {
			this.source.onended = this.config.onendedGenerator(this.id) as
				(this: AudioScheduledSourceNode, ev: Event) => any;
		}
	}

	isPaused(): boolean {
		return this.paused;
	}

	pause() {
		if (!this.paused) {
			this.source!.stop();
			this.playedTime += this.source!.context.currentTime - this.startTime;
			this.paused = true;
			this.startTime = 0;
		}
	}

	resume() {
		if (this.paused) {
			this.paused = false;
			const prevStartOffset: number = this.startOffset;
			this.initFromConfig();
			this.startOffset = prevStartOffset + this.playedTime;
			this.startOffset = this.startOffset % this.source!.buffer!.duration;
			const curAudioTime: number = this.source!.context.currentTime;
			this.source!.start(curAudioTime, this.startOffset);
			this.startTime = curAudioTime;
			this.playedTime = 0;
		}
	}

	start() {
		this.paused = false;
		this.initFromConfig();
		const curAudioTime: number = this.source!.context.currentTime;
		this.source!.start(curAudioTime, this.startOffset);
		this.startTime = curAudioTime;
		this.playedTime = 0;
	}

}

const DEFAULT_MUSIC_FADE_SECONDS: number = 0.3;
const MILLIS_PER_SECOND: number = 1000;

/**
 * A wrapper around web audio for games.
 */
export default class AudioSystem {

	private currentMusic?: AudioBufferSourceNode;
	private readonly sounds: { [id: string]: Sound };
	private musicFade: number;
	private doFadeMusic: boolean;
	private muted: boolean;
	private initialized: boolean;

	context!: AudioContext;
	private volumeFaderGain!: GainNode;
	private musicFaderGain?: GainNode;
	private currentMusicId!: string;
	private musicLoopStart!: number;

	/**
	 * A list of all sound effects currently being played.  If a sound effect
	 * is not looping (which is likely typical), it will be removed from this
	 * list when it completes.  This data structure allows us to pause all sound
	 * effects at the same time.
	 */
	private readonly playingSounds: PlayingSound[];

	/**
	 * Used to give all playing sound effects unique ids.
	 */
	private soundEffectIdGenerator: number;

	/**
	 * A wrapper around web audio for games.
	 */
	constructor() {
		this.currentMusic = undefined;
		this.sounds = {};
		this.musicFade = DEFAULT_MUSIC_FADE_SECONDS;
		this.doFadeMusic = true;
		this.muted = false;
		this.initialized = false;
		this.playingSounds = [];
		this.soundEffectIdGenerator = 0;
	}

	private createPlayingSound(id: string, loop: boolean = false,
			startOffset: number = 0, doneCallback?: SoundCompletedCallback): PlayingSound {

		const soundEffectId: number = this.createSoundEffectId();

		return new PlayingSound({
			audioSystem: this,
			buffer: this.sounds[id].getBuffer(),
			connectTo: this.volumeFaderGain,
			id: soundEffectId,
			loop: loop,
			onendedGenerator: (playingSoundId: number) => {
				return () => {
					this.removePlayingSound(playingSoundId);
					if (doneCallback) {
						doneCallback(soundEffectId, id);
					}
				};
			},
			soundId: id,
			startOffset: startOffset,
		});
	}

	private createSoundEffectId(): number {
		return this.soundEffectIdGenerator++;
	}

	/**
	 * Initializes the audio system.
	 */
	init(): boolean {

		// Effectively cast to our window extension for static typing
		const w: Window = window as any;

		try {

			w.AudioContext = w.AudioContext || w.webkitAudioContext;

			if (w.AudioContext) {
				this.context = new w.AudioContext();
				console.log('--- ' + this.context);
				this.volumeFaderGain = this.context.createGain();
				this.volumeFaderGain.gain.setValueAtTime(1, this.context.currentTime);
				this.volumeFaderGain.gain.value = 1;
				this.volumeFaderGain.connect(this.context.destination);
				this.initialized = true;
			}
			else {
				console.log('The Web Audio API is not supported in this browser.');
			}
		} catch (e) {
			console.error('The Web Audio API is not supported in this browser.');
			console.error(e);
		}

		return this.initialized;
	}

	/**
	 * Registers a sound for later playback.
	 * @param sound The sound.
	 */
	addSound(sound: Sound) {
		if (this.context) {
			this.sounds[sound.getId()] = sound;
		}
	}

	fadeOutMusic(newMusicId: string) {

		if (this.context) {
			if (this.currentMusic) {
				if (!this.muted) {
					// We must "anchor" via setValueAtTime() before calling a *rampToValue() method (???)
					this.musicFaderGain!.gain.setValueAtTime(this.musicFaderGain!.gain.value, this.context.currentTime);
					this.musicFaderGain!.gain.linearRampToValueAtTime(0, this.context.currentTime + this.musicFade);
				}
				setTimeout(() => {
					this.playMusic(newMusicId);
				}, this.musicFade * MILLIS_PER_SECOND);
			}
			else {
				this.playMusic(newMusicId);
			}
		}
	}

	/**
	 * Returns the ID of the current music being played.
	 *
	 * @return The current music's ID.
	 * @see playMusic
	 * @see stopMusic
	 */
	getCurrentMusic(): string {
		return this.currentMusicId;
	}

	/**
	 * Returns whether the audio system initialized properly.  This will return
	 * false if the user's browser does not support the web audio API.
	 * @return Whether the sound system is initialized
	 */
	isInitialized(): boolean {
		return this.initialized;
	}

	/**
	 * Pauses all music and sound effects.
	 * @see resumeAll
	 */
	pauseAll() {
		this.playingSounds.forEach((sound: PlayingSound) => {
			sound.pause();
		});
	}

	/**
	 * Plays a specific sound as background music.  Only one "music" can play at a time,
	 * as opposed to "sounds," of which multiple can be playing at one time.
	 * @param id The ID of the resource to play as music.  If this is <code>null</code>,
	 *        the current music is stopped but no new music is started.
	 * @param [loop] Whether the music should loop.  If this is omitted, looping is determined
	 *        by the sound's <code>getLoopsByDefaultIfMusic()</code> method.
	 * @see stopMusic
	 */
	playMusic(id: string | null | undefined, loop?: boolean) {

		if (this.context) {

			// Note: We destroy and recreate musicFaderGain each time, because
			// it appears to occasionally start playing muted if we do not do
			// so, even when gain.value===1, on Chrome 38.
			if (this.currentMusic) {
				this.stopMusic(false);
			}

			if (!id) {
				return; // null id => don't play any music
			}
			const sound: Sound = this.sounds[id];
			if (typeof loop === 'undefined') {
				loop = sound.getLoopsByDefaultIfMusic();
			}

			this.musicFaderGain = this.context.createGain();
			this.musicFaderGain.gain.setValueAtTime(1, this.context.currentTime);
			this.musicFaderGain.gain.value = 1;
			this.currentMusic = this.context.createBufferSource();
			this.currentMusic.loop = loop;
			this.musicLoopStart = sound.getLoopStart() || 0;
			this.currentMusic.loopStart = this.musicLoopStart;
			this.currentMusic.buffer = sound.getBuffer();
			this.currentMusic.loopEnd = this.currentMusic.buffer.duration;
			this.currentMusic.connect(this.musicFaderGain);
			this.musicFaderGain.connect(this.volumeFaderGain);
			this.currentMusic.start(0);
			this.currentMusicId = id;
			console.log(`Just started new music with id: ${id}, loop: ${loop}`);

		}

	}

	/**
	 * Plays the sound with the given ID.
	 * @param id The ID of the resource to play.
	 * @param loop Whether the music should loop.  Defaults to <code>false</code>.
	 * @param doneCallback An optional callback to call when the
	 *        sound completes. This callback will receive the returned numeric
	 *        ID as a parameter.  This parameter is ignored if <code>loop</code>
	 *        is <code>true</code>.
	 * @return An ID for the playing sound.  This can be used to
	 *         stop a looping sound via <code>stopSound(id)</code>.
	 * @see stopSound
	 */
	playSound(id: string, loop: boolean = false, doneCallback?: SoundCompletedCallback): number {
		if (this.context) {

			const playingSound: PlayingSound = this.createPlayingSound(id, loop, 0, doneCallback);
			this.playingSounds.push(playingSound);
			playingSound.start();
			return playingSound.id;
		}

		return -1;
	}

	/**
	 * Removes a sound from our list of currently-being-played sound effects.
	 * @param id The sound effect to stop playing.
	 * @return The sound just removed, or <code>null</code> if there was no such sound.
	 */
	private removePlayingSound(id: number): PlayingSound | null {
		for (let i: number = 0; i < this.playingSounds.length; i++) {
			if (this.playingSounds[i].id === id) {
				const sound: PlayingSound = this.playingSounds[i];
				this.playingSounds.splice(i, 1);
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

		for (let i: number = 0; i < this.playingSounds.length; i++) {
			const sound: PlayingSound = this.playingSounds[i];
			if (sound.isPaused()) {
				sound.resume();
			}
		}
	}

	/**
	 * Stops the currently playing music, if any.
	 * @param pause If <code>true</code>, the music is only paused; otherwise,
	 *        native resources are freed and the music cannot be resumed.
	 * @see playMusic
	 */
	stopMusic(pause: boolean = false) {
		if (this.currentMusic) {
			this.currentMusic.stop();
			if (!pause) {
				this.currentMusic.disconnect();
				this.musicFaderGain!.disconnect();
				delete this.currentMusic;
				delete this.musicFaderGain;
			}
		}
	}

	/**
	 * Stops a playing sound, by ID.
	 * @param id The sound effect to stop.
	 * @return Whether the sound effect was stopped.  This will be
	 *         <code>false</code> if the sound effect specified is no longer
	 *         playing.
	 * @see playSound
	 */
	stopSound(id: number): boolean {
		const sound: PlayingSound | null = this.removePlayingSound(id);
		if (sound && sound.source) {
			sound.source.stop();
			return true;
		}
		return false;
	}

	toggleMuted(): boolean {
		this.muted = !this.muted;
		if (this.context) {
			const initialValue: number = this.muted ? 0 : 1;
			this.volumeFaderGain.gain.setValueAtTime(initialValue, this.context.currentTime);
			this.volumeFaderGain.gain.value = initialValue;
		}
		return this.muted;
	}

	get fadeMusic(): boolean {
		return this.doFadeMusic;
	}

	set fadeMusic(fade: boolean) {
		this.doFadeMusic = fade;
	}

	get musicFadeSeconds(): number {
		return this.musicFade;
	}

	set musicFadeSeconds(seconds: number) {
		this.musicFade = seconds;
	}
}
