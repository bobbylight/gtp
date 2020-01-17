import { State, FadeOutInState } from '../index';
import Game from './Game';

/**
 * A typed wrapper class to keep tslint happy in this unit test class.
 */
interface FunctionWrapperForTesting {
	transitionLogic: () => string;
}

describe('FadeOutInState', () => {
	'use strict';

	it('constructor happy path', () => {

		const leavingState: State<Game> = new State<Game>();
		const enteringState: State<Game> = new State<Game>();
		const temp: FunctionWrapperForTesting = {
			transitionLogic: () => {
				return 'foo';
			}
		};
		const timeMillis: number = 500;

		spyOn(temp, 'transitionLogic');

		const state: FadeOutInState<Game> = new FadeOutInState<Game>(leavingState, enteringState,
			temp.transitionLogic, timeMillis);
		expect(state).toBeDefined();
		expect(temp.transitionLogic).not.toHaveBeenCalled();
	});

	it('transitionLogic is called at halfway point', () => {

		const leavingState: State<Game> = new State<Game>();
		const enteringState: State<Game> = new State<Game>();
		const temp: FunctionWrapperForTesting = {
			transitionLogic: () => {
				return 'foo';
			}
		};
		const timeMillis: number = 500;

		spyOn(temp, 'transitionLogic');

		const state: FadeOutInState<Game> = new FadeOutInState<Game>(leavingState, enteringState,
			temp.transitionLogic, timeMillis);
		expect(temp.transitionLogic).not.toHaveBeenCalled();

		state.update(timeMillis / 2 - 1);
		expect(temp.transitionLogic).not.toHaveBeenCalled();

		state.update(1);
		expect(temp.transitionLogic).toHaveBeenCalled();
	});
});
