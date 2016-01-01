/**
 * Extending TypeScript's Window definition with miscellaneous properties it
 * is not aware of.
 */
interface Window {

	AudioContext: any;
	webkitAudioContext: any;
	
	/**
	 * The singleton game instance as a global variable.
	 */
	game: gtp.Game;
}
