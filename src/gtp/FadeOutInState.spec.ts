import { beforeEach, Mock, MockInstance } from 'vitest';
import { State, FadeOutInState, Game } from '../index.js';

interface FunctionWrapperForTesting {
	transitionLogic: () => string;
}

describe('FadeOutInState', () => {

	let game: Game;

	beforeEach(() => {
		game = new Game();
	});

	afterEach(() => {
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('constructor happy path', () => {

		const leavingState: State<Game> = new State<Game>(game);
		const enteringState: State<Game> = new State<Game>(game);
		const temp: FunctionWrapperForTesting = {
			transitionLogic: vi.fn(),
		};
		const timeMillis = 500;

		const state: FadeOutInState<Game> = new FadeOutInState<Game>(leavingState, enteringState,
			temp.transitionLogic, timeMillis);
		expect(state).toBeDefined();
		expect(temp.transitionLogic).not.toHaveBeenCalled();
	});

	describe('render()', () => {

		let game: Game;
		let gameSetStateSpy: MockInstance<Game['setState']>;
		let mockLeavingState: State<Game>;
		let mockEnteringState: State<Game>;
		let mockLeavingRenderSpy: MockInstance<Game['render']>;
		let mockEnteringRenderSpy: MockInstance<Game['render']>;
		let transitionLogicSpy: Mock<() => void>;
		let timeMillis: number;
		let fadeState: FadeOutInState<Game>;

		beforeEach(() => {
			game = {
				clearScreen: () => {
				},
				setState: (state: State<Game>) => {
				},
			} as Game;

			gameSetStateSpy = vi.spyOn(game, 'setState');
			mockLeavingState = new State<Game>(game);
			mockEnteringState = new State<Game>(game);
			mockLeavingRenderSpy = vi.spyOn(mockLeavingState, 'render').mockImplementation(() => {
			});
			mockEnteringRenderSpy = vi.spyOn(mockEnteringState, 'render').mockImplementation(() => {
			});

			transitionLogicSpy = vi.fn();
			timeMillis = 500;

			fadeState = new FadeOutInState<Game>(mockLeavingState, mockEnteringState, transitionLogicSpy, timeMillis);
			fadeState.enter();

			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.runOnlyPendingTimers();
			vi.useRealTimers();
			vi.restoreAllMocks();
		});

		it('fades out the leaving state then fades in the entering state', () => {

			expect(mockLeavingRenderSpy).not.toHaveBeenCalled();
			expect(mockEnteringRenderSpy).not.toHaveBeenCalled();
			expect(transitionLogicSpy).not.toHaveBeenCalled();
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				throw new Error('Could not create canvas context');
			}

			// Initial render (start of fading out)
			fadeState.render(ctx);
			expect(gameSetStateSpy).not.toHaveBeenCalled();
			expect(mockLeavingRenderSpy).toHaveBeenCalledExactlyOnceWith(ctx);
			expect(mockEnteringRenderSpy).not.toHaveBeenCalled();
			expect(transitionLogicSpy).not.toHaveBeenCalled();
			mockLeavingRenderSpy.mockClear(); // Clear mock history for next assertions

			// Advance time to just before halfway
			const firstHalfDuration = timeMillis / 2;
			fadeState.update(firstHalfDuration - 1); // Update internal timer
			vi.advanceTimersByTime(firstHalfDuration - 1); // Advance fake timers
			fadeState.render(ctx);
			expect(gameSetStateSpy).not.toHaveBeenCalled();
			expect(mockLeavingRenderSpy).toHaveBeenCalledExactlyOnceWith(ctx);
			expect(mockEnteringRenderSpy).not.toHaveBeenCalled();
			expect(transitionLogicSpy).not.toHaveBeenCalled();
			mockLeavingRenderSpy.mockClear();

			// Advance time to the halfway point
			fadeState.update(1);
			vi.advanceTimersByTime(1);
			expect(transitionLogicSpy).toHaveBeenCalledExactlyOnceWith();
			fadeState.render(ctx);
			expect(gameSetStateSpy).not.toHaveBeenCalled();
			expect(mockLeavingRenderSpy).not.toHaveBeenCalled();
			expect(mockEnteringRenderSpy).toHaveBeenCalledExactlyOnceWith(ctx);
			mockEnteringRenderSpy.mockClear(); // Clear mock history for next assertions
			transitionLogicSpy.mockClear();

			// Advance time to just before completion
			const secondHalfDuration = timeMillis / 2;
			fadeState.update(secondHalfDuration - 1); // Update internal timer
			vi.advanceTimersByTime(secondHalfDuration - 1); // Advance fake timers
			fadeState.render(ctx);
			expect(gameSetStateSpy).not.toHaveBeenCalled();
			expect(mockLeavingRenderSpy).not.toHaveBeenCalled();
			expect(mockEnteringRenderSpy).toHaveBeenCalledExactlyOnceWith(ctx);
			expect(transitionLogicSpy).not.toHaveBeenCalled();
			mockEnteringRenderSpy.mockClear();

			// Advance time to completion
			fadeState.update(1);
			vi.advanceTimersByTime(1);
			fadeState.render(ctx);
			expect(gameSetStateSpy).toHaveBeenCalledExactlyOnceWith(mockEnteringState);
			expect(mockLeavingRenderSpy).not.toHaveBeenCalled();
			expect(mockEnteringRenderSpy).toHaveBeenCalledExactlyOnceWith(ctx);
			expect(transitionLogicSpy).not.toHaveBeenCalled();
		});
	});

	it('transitionLogic is called at halfway point', () => {

		const leavingState: State<Game> = new State<Game>(game);
		const enteringState: State<Game> = new State<Game>(game);
		const temp: FunctionWrapperForTesting = {
			transitionLogic: vi.fn(),
		};
		const timeMillis = 500;

		const state: FadeOutInState<Game> = new FadeOutInState<Game>(leavingState, enteringState,
			temp.transitionLogic, timeMillis);
		expect(temp.transitionLogic).not.toHaveBeenCalled();

		state.update(timeMillis / 2 - 1);
		expect(temp.transitionLogic).not.toHaveBeenCalled();

		state.update(1);
		expect(temp.transitionLogic).toHaveBeenCalled();
	});
});
