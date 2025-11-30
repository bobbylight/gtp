import { describe, vi } from 'vitest';
import InputManager from './InputManager.js';
import { Keys } from './Keys.js';

describe('InputManager', () => {
	let originalOnKeyDown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
	let originalOnKeyUp: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
	let inputManager: InputManager;

	beforeAll(() => {
		originalOnKeyDown = document.onkeydown;
		originalOnKeyUp = document.onkeyup;
	});

	afterAll(() => {
		document.onkeydown = originalOnKeyDown;
		document.onkeyup = originalOnKeyUp;
	});

	beforeEach(() => {
		document.onkeydown = null;
		document.onkeyup = null;
		inputManager = new InputManager();
		inputManager.install();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	const simulateKeyDown = (keyCode: Keys, preventDefault = vi.fn(), stopPropagation = vi.fn()) => {
		const event = new KeyboardEvent('keydown', { keyCode: keyCode } as KeyboardEventInit);
		vi.spyOn(event, 'preventDefault').mockImplementation(preventDefault);
		vi.spyOn(event, 'stopPropagation').mockImplementation(stopPropagation);
		document.onkeydown?.(event);
		return event;
	};

	const simulateKeyUp = (keyCode: Keys, preventDefault = vi.fn(), stopPropagation = vi.fn()) => {
		const event = new KeyboardEvent('keyup', { keyCode: keyCode } as KeyboardEventInit);
		vi.spyOn(event, 'preventDefault').mockImplementation(preventDefault);
		vi.spyOn(event, 'stopPropagation').mockImplementation(stopPropagation);
		document.onkeyup?.(event);
		return event;
	};

	describe('constructor', () => {
		it('initializes properties correctly with default refireMillis', () => {
			expect(() => {
				new InputManager();
			}).not.toThrowError();
		});

		it('initializes properties correctly with custom refireMillis', () => {
			expect(() => {
				new InputManager(100);
			}).not.toThrowError();
		});
	});

	it('install() sets document.onkeydown and document.onkeyup handlers', () => {
		expect(document.onkeydown).toBeDefined();
		expect(document.onkeyup).toBeDefined();
	});

	describe('isKeyDown()', () => {
		it('returns false for a key not pressed', () => {
			expect(inputManager.isKeyDown(Keys.KEY_LEFT_ARROW)).toEqual(false);
		});

		it('returns true after keydown and false after keyup', () => {
			simulateKeyDown(Keys.KEY_SPACE);
			expect(inputManager.isKeyDown(Keys.KEY_SPACE)).toEqual(true);

			simulateKeyUp(Keys.KEY_SPACE);
			expect(inputManager.isKeyDown(Keys.KEY_SPACE)).toEqual(false);
		});

		it('with clear=true clears the key state', () => {
			simulateKeyDown(Keys.KEY_RIGHT_ARROW);
			expect(inputManager.isKeyDown(Keys.KEY_RIGHT_ARROW, true)).toEqual(true);
			expect(inputManager.isKeyDown(Keys.KEY_RIGHT_ARROW)).toEqual(false);
		});
	});

	it('clearKeyState() resets a specific key', () => {
		simulateKeyDown(Keys.KEY_UP_ARROW);
		expect(inputManager.isKeyDown(Keys.KEY_UP_ARROW)).toEqual(true);
		inputManager.clearKeyState(Keys.KEY_UP_ARROW);
		expect(inputManager.isKeyDown(Keys.KEY_UP_ARROW)).toEqual(false);
	});

	it('clearKeyStates() resets all keys', () => {
		simulateKeyDown(Keys.KEY_A);
		simulateKeyDown(Keys.KEY_B);
		expect(inputManager.isKeyDown(Keys.KEY_A)).toEqual(true);
		expect(inputManager.isKeyDown(Keys.KEY_B)).toEqual(true);

		inputManager.clearKeyStates();
		expect(inputManager.isKeyDown(Keys.KEY_A)).toEqual(false);
		expect(inputManager.isKeyDown(Keys.KEY_B)).toEqual(false);
	});

	describe('helper methods', () => {
		it('ctrl() works', () => {
			simulateKeyDown(Keys.KEY_CTRL);
			expect(inputManager.ctrl()).toEqual(true);
			simulateKeyUp(Keys.KEY_CTRL);
			expect(inputManager.ctrl()).toEqual(false);
		});

		it('down() works', () => {
			simulateKeyDown(Keys.KEY_DOWN_ARROW);
			expect(inputManager.down()).toEqual(true);
			simulateKeyUp(Keys.KEY_DOWN_ARROW);
			expect(inputManager.down()).toEqual(false);
		});

		it('enter() works', () => {
			simulateKeyDown(Keys.KEY_ENTER);
			expect(inputManager.enter()).toEqual(true);
			simulateKeyUp(Keys.KEY_ENTER);
			expect(inputManager.enter()).toEqual(false);
		});

		it('left() works', () => {
			simulateKeyDown(Keys.KEY_LEFT_ARROW);
			expect(inputManager.left()).toEqual(true);
			simulateKeyUp(Keys.KEY_LEFT_ARROW);
			expect(inputManager.left()).toEqual(false);
		});

		it('right() works', () => {
			simulateKeyDown(Keys.KEY_RIGHT_ARROW);
			expect(inputManager.right()).toEqual(true);
			simulateKeyUp(Keys.KEY_RIGHT_ARROW);
			expect(inputManager.right()).toEqual(false);
		});

		it('shift() works', () => {
			simulateKeyDown(Keys.KEY_SHIFT);
			expect(inputManager.shift()).toEqual(true);
			simulateKeyUp(Keys.KEY_SHIFT);
			expect(inputManager.shift()).toEqual(false);
		});

		it('up() works', () => {
			simulateKeyDown(Keys.KEY_UP_ARROW);
			expect(inputManager.up()).toEqual(true);
			simulateKeyUp(Keys.KEY_UP_ARROW);
			expect(inputManager.up()).toEqual(false);
		});
	});

	describe('key repeat with refireMillis', () => {

		let im: InputManager;
		const refire = 50;

		beforeEach(() => {
			im = new InputManager(refire);
			im.install();
		});

		it('will refire "down" events appropriately', () => {
			simulateKeyDown(Keys.KEY_D);
			expect(im.isKeyDown(Keys.KEY_D, true)).toEqual(true);

			// A second query returns the key as up, even though the physical key is still down
			expect(im.isKeyDown(Keys.KEY_D, true)).toEqual(false);

			// Key is still considered to be held down up to the final millisecond
			vi.advanceTimersByTime(refire - 1);
			expect(im.isKeyDown(Keys.KEY_D, true)).toEqual(false);

			// Keys "refire" at the appropriate time
			vi.advanceTimersByTime(1);
			expect(im.isKeyDown(Keys.KEY_D, true)).toEqual(true);
			expect(im.isKeyDown(Keys.KEY_D, true)).toEqual(false);
		});

		it('clearKeyState() clears key and interval with refireMillis', () => {
			simulateKeyDown(Keys.KEY_S);
			expect(im.isKeyDown(Keys.KEY_S)).toEqual(true);

			im.clearKeyState(Keys.KEY_S);
			expect(im.isKeyDown(Keys.KEY_S)).toEqual(false);

			// Key doesn't refire even after the specified interval
			vi.advanceTimersByTime(refire + 1);
			expect(im.isKeyDown(Keys.KEY_S)).toEqual(false);
		});

		it('clearKeyStates() clears all keys and intervals with refireMillis', () => {
			simulateKeyDown(Keys.KEY_W);
			simulateKeyDown(Keys.KEY_A);
			expect(im.isKeyDown(Keys.KEY_W)).toEqual(true);
			expect(im.isKeyDown(Keys.KEY_A)).toEqual(true);

			im.clearKeyStates();
			expect(im.isKeyDown(Keys.KEY_W)).toEqual(false);
			expect(im.isKeyDown(Keys.KEY_A)).toEqual(false);

			// Keys don't refire even after the specified interval'
			vi.advanceTimersByTime(refire + 1);
			expect(im.isKeyDown(Keys.KEY_W)).toEqual(false);
			expect(im.isKeyDown(Keys.KEY_A)).toEqual(false);
		});
	});

	describe('event propagation and prevention', () => {
		it('preventDefault is called for arrow keys and space on keydown', () => {
			const preventDefaultSpy = vi.fn();
			const stopPropagationSpy = vi.fn();

			simulateKeyDown(Keys.KEY_LEFT_ARROW, preventDefaultSpy, stopPropagationSpy);
			expect(preventDefaultSpy).toHaveBeenCalledExactlyOnceWith();
			expect(stopPropagationSpy).toHaveBeenCalledExactlyOnceWith();

			preventDefaultSpy.mockClear();
			stopPropagationSpy.mockClear();

			simulateKeyDown(Keys.KEY_SPACE, preventDefaultSpy, stopPropagationSpy);
			expect(preventDefaultSpy).toHaveBeenCalledExactlyOnceWith();
			expect(stopPropagationSpy).toHaveBeenCalledExactlyOnceWith();
		});

		it('preventDefault is not called for other keys on keydown', () => {
			const preventDefaultSpy = vi.fn();
			const stopPropagationSpy = vi.fn();

			simulateKeyDown(Keys.KEY_Z, preventDefaultSpy, stopPropagationSpy);
			expect(preventDefaultSpy).not.toHaveBeenCalled();
			expect(stopPropagationSpy).toHaveBeenCalledExactlyOnceWith();
		});

		it('stopPropagation is always called on keyup', () => {
			const preventDefaultSpy = vi.fn();
			const stopPropagationSpy = vi.fn();

			simulateKeyUp(Keys.KEY_Z, preventDefaultSpy, stopPropagationSpy);
			expect(preventDefaultSpy).not.toHaveBeenCalled();
			expect(stopPropagationSpy).toHaveBeenCalledOnce();

			stopPropagationSpy.mockClear();

			simulateKeyUp(Keys.KEY_LEFT_ARROW, preventDefaultSpy, stopPropagationSpy);
			expect(preventDefaultSpy).not.toHaveBeenCalled(); // No preventDefault on keyup
			expect(stopPropagationSpy).toHaveBeenCalledExactlyOnceWith();
		});
	});
});
