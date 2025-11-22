import Game from './Game.js';

/**
 * Extending TypeScript's Window definition with miscellaneous properties it
 * is not aware of.
 */
export interface Window {
	/**
	 * The singleton game instance as a global variable.
	 */
	game: Game;
}
