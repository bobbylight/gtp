import { Timer } from '../index.js';

describe('Timer', () => {

	let debugContent: string,
		errorContent: string;

	beforeEach(() => {
		debugContent = '';
		errorContent = '';

		// Note we are assuming that console.log/error are called with 1 argument
		// here...
		jest.spyOn(console, 'log').mockImplementation((arg: string) => {
			debugContent += arg + '\n';
		});
		jest.spyOn(console, 'error').mockImplementation((arg: string) => {
			errorContent += arg + '\n';
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('logging, happy path, single event', () => {

		const timer: Timer = new Timer();

		timer.start('work');
		timer.endAndLog('work');

		expect(debugContent).toMatch(/^DEBUG: work: [\d.]+ ms/);
	});

	it('logging, unknown key passed to endAndLog', () => {

		const timer: Timer = new Timer();

		timer.start('work');
		timer.endAndLog('twerk');

		expect(debugContent).toBe('');
		expect(errorContent).toBe('Cannot end timer for "twerk" as it was never started\n');
	});

	it('setLogPrefix, new value', () => {

		const timer: Timer = new Timer();
		timer.setLogPrefix('TEST');

		timer.start('work');
		timer.endAndLog('work');

		expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms/);
	});

	it('setLogPrefix, resetting to default', () => {

		const timer: Timer = new Timer();
		timer.setLogPrefix('TEST');

		timer.start('work');
		timer.endAndLog('work');

		expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms/);

		timer.setLogPrefix(); // Should reset

		timer.start('work2');
		timer.endAndLog('work2');

		expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms\nDEBUG: work2: [\d.]+ ms/);
	});

});
