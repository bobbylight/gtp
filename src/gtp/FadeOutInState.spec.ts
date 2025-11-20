import { State, FadeOutInState } from '../index.js';
import Game from './Game.js';

interface FunctionWrapperForTesting {
	transitionLogic: () => string;
}

describe('FadeOutInState', () => {

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('constructor happy path', () => {

		const leavingState: State<Game> = new State<Game>();
		const enteringState: State<Game> = new State<Game>();
		const temp: FunctionWrapperForTesting = {
			transitionLogic: jest.fn(),
		};
		const timeMillis= 500;

		const state: FadeOutInState<Game> = new FadeOutInState<Game>(leavingState, enteringState,
			temp.transitionLogic, timeMillis);
		expect(state).toBeDefined();
		expect(temp.transitionLogic).not.toHaveBeenCalled();
	});

	it('transitionLogic is called at halfway point', () => {

		const leavingState: State<Game> = new State<Game>();
		const enteringState: State<Game> = new State<Game>();
		const temp: FunctionWrapperForTesting = {
			transitionLogic: jest.fn(),
		};
		const timeMillis= 500;

		const state: FadeOutInState<Game> = new FadeOutInState<Game>(leavingState, enteringState,
			temp.transitionLogic, timeMillis);
		expect(temp.transitionLogic).not.toHaveBeenCalled();

		state.update(timeMillis / 2 - 1);
		expect(temp.transitionLogic).not.toHaveBeenCalled();

		state.update(1);
		expect(temp.transitionLogic).toHaveBeenCalled();
	});
});
