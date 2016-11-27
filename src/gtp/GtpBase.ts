import Game from './Game';

/**
 * Extending TypeScript's Window definition with miscellaneous properties it
 * is not aware of.
 */
export interface Window {

	AudioContext: any;
	webkitAudioContext: any;

	/**
	 * The singleton game instance as a global variable.
	 */
	game: Game;
}
