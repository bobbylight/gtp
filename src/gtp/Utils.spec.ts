import { Utils, BrowserUtil } from '../index';

// tslint:disable:no-magic-numbers
describe('Utils', () => {
	'use strict';

	it('constructor happy path, even though not used', () => {
		expect(Utils).not.toBeNull();
	});

	it('getObjectSize() happy path', () => {

		let obj: Object = {};
		expect(Utils.getObjectSize(obj)).toBe(0);

		obj = { one: 1, two: 2 };
		expect(Utils.getObjectSize(obj)).toBe(2);
	});

	it('getRequestParam() param found, no values, multiple params', () => {

		spyOn(BrowserUtil, 'getWindowLocationSearch')
			.and.returnValue('?foo&bar&bas');

		expect(Utils.getRequestParam('foo')).toBe('');
		expect(Utils.getRequestParam('bar')).toBe('');
		expect(Utils.getRequestParam('bas')).toBe('');
	});

	it('getRequestParam() param found, values, multiple params', () => {

		spyOn(BrowserUtil, 'getWindowLocationSearch')
			.and.returnValue('?foo=fooValue&bar=barValue&bas=basValue');

		expect(Utils.getRequestParam('foo')).toBe('fooValue');
		expect(Utils.getRequestParam('bar')).toBe('barValue');
		expect(Utils.getRequestParam('bas')).toBe('basValue');
	});

	it('getRequestParam() param not found', () => {

		spyOn(BrowserUtil, 'getWindowLocationSearch')
			.and.returnValue('?foo=fooValue&bar=barValue&bas=basValue');

		expect(Utils.getRequestParam('notFound')).toBeNull();
	});

	it('getRequestParam() param not found, substring of param', () => {

		spyOn(BrowserUtil, 'getWindowLocationSearch')
			.and.returnValue('?debugMode=true');

		expect(Utils.getRequestParam('debug')).toBeNull();
	});

	it('randomInt(), max only', () => {

		expect(Utils.randomInt(1)).toBe(0);

		const result: number = Utils.randomInt(5);
		expect(result >= 0).toBeTruthy();
		expect(result).toBeLessThan(5);
	});

	it('randomInt(), min and max', () => {

		let result: number = Utils.randomInt(1);
		expect(result).toBe(0);

		result = Utils.randomInt(0, 5);
		expect(result >= 0).toBeTruthy();
		expect(result).toBeLessThan(5);

		result = Utils.randomInt(100, 150);
		expect(result >= 100).toBeTruthy();
		expect(result).toBeLessThan(150);
	});

	it('timestamp()', () => {

		// Smaller delays cause occasional issues due to our use of window.performance
		const DELAY: number = 300;

		const start: number = Utils.timestamp();
		const waitUntil: number = Date.now() + DELAY + 1; // Wait > 300 milliseconds
		while (Date.now() < waitUntil) {}
		const end: number = Utils.timestamp();
		expect(end).toBeGreaterThan(start + 1);
	});

	it('initConsole() with console defined', () => {
		const mockConsole: any = {
			info: 1,
			log: 2,
			warn: 3,
			'error': 4
		};
		const origConsole: Console = window.console;
		(window as any).console = mockConsole;
		Utils.initConsole();
		expect((window as any).console).toBe(mockConsole);
		(window as any).console = origConsole;
	});

	it('initConsole() with console undefined', () => {
		const origConsole: Console = window.console;
		(window as any).console = null;
		Utils.initConsole();
		expect(window.console).not.toBeNull();
		(window as any).console = origConsole;
	});
});
