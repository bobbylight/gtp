import { State } from '../index.js';

describe('State', () => {

	it('constructor happy path', () => {
		expect(() => {
			new State();
		}).not.toThrowError();
	});
});
