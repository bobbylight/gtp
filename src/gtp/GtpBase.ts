import Game from './Game';

/**
 * Because the <code>AudioContext</code> constructor is hidden behind a vendor prefix in some browsers,
 * here we match the signature defined in <code>lib.dom.d.ts</code> so we can write typesafe code that
 * checks for, and creates, an <code>AudioContext</code> if the constructor is available.
 */
interface AudioContextConstructor {
	new(contextOptions?: AudioContextOptions): AudioContext;
}

/**
 * Extending TypeScript's Window definition with miscellaneous properties it
 * is not aware of.
 */
export interface Window {

	AudioContext: AudioContextConstructor | undefined;
	webkitAudioContext: AudioContextConstructor | undefined;

	/**
	 * The singleton game instance as a global variable.
	 */
	game: Game;
}
