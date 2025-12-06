import { Game, State } from '../index.js';

describe('State', () => {

	it('constructor happy path', () => {
		const game = new Game();
		expect(() => {
			new State(game);
		}).not.toThrowError();
	});
});
