import BrowserUtil from './BrowserUtil';

/**
 * Obligatory utility methods for games.
 * @constructor
 */
export default class Utils {

	/**
	 * Returns the number of elements in an object.
	 *
	 * @param {object} obj The object.
	 * @return {int} The number of elements in the object.
	 */
	static getObjectSize(obj: Object): number {
		let size: number = 0;
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				size++;
			}
		}
		return size;
	}

	/**
	 * Returns the value of a request parameter.
	 *
	 * @param {string} param The name of the request parameter.
	 * @return {string} The value of the request parameter, or <code>null</code>
	 *         if it was not specified.
	 */
	static getRequestParam(param: string): string | null {

		// Replace leading '?' with '&'
		const params: string = '&' + BrowserUtil.getWindowLocationSearch().substring(1);

		const searchFor: string = '&' + param;
		const index: number = params.indexOf(searchFor);
		if (index >= -1) {
			let start: number = index + searchFor.length;
			if (params.charAt(start) === '=') {
				start++;
				let end: number = params.indexOf('&', start); // &foo=val1&bar=val2
				if (end === -1) {
					end = params.length; // &foo=val1
				}
				return params.substring(start, end);
			}
			else if (params.charAt(start) === '&') {
				return ''; // &foo&bar
			}
			else if (start === params.length) {
				return ''; // &foo
			}
		}
		return null;
	}

	/**
	 * Equivalent to dojo/_base/hitch, returns a function in a specific scope.
	 *
	 * @param {object} scope The scope to run the function in (e.g. the value of
	 *        "this").
	 * @param {function} func The function.
	 * @return {function} A function that does the same thing as 'func', but in the
	 *         specified scope.
	 */
	static hitch(scope: any, func: Function): Function {
		// "arguments" cannot be referenced in arrow functions
		return function() { // tslint:disable-line:only-arrow-functions
			func.apply(scope, arguments);
		};
	}

	/**
	 * Adds the properties of one element into another.
	 *
	 * @param {object} source The object with properties to mix into another object.
	 * @param {object} target The object that will receive the new properties.
	 */
	static mixin(source: any, target: any) {
		for (let prop in source) {
			if (source.hasOwnProperty(prop)) {
				//if (!target[prop]) {
				target[prop] = source[prop];
				//}
			}
		}
	}

	/**
	 * Returns a random integer between min (inclusive) and max (exclusive).  If
	 * max is omitted, the single parameter is treated as the maximum value, and
	 * an integer is returned in the range 0 - value.
	 *
	 * @param {int} [min=0] The minimum possible value, inclusive.
	 * @param {int} max The maximum possible value, exclusive.
	 * @return {int} The random integer value.
	 */
	static randomInt(min: number, max: number): number;
	static randomInt(max: number): number;
	static randomInt(min: number, max?: number): number {
		let realMin: number, realMax: number;
		if (typeof max === 'undefined') {
			realMin = 0;
			realMax = min;
		}
		else {
			realMin = min;
			realMax = max;
		}
		// Using Math.round() will give you a non-uniform distribution!
		return Math.floor(Math.random() * (realMax - realMin)) + realMin;
	}

	/**
	 * Returns a time in milliseconds.  This will be high resolution, if
	 * possible.  This method should be used to implement constructs like
	 * delays.
	 * @return {number} A time, in milliseconds.
	 */
	static timestamp(): number {
		if (window.performance && window.performance.now) {
			return window.performance.now();
		}
		return Date.now(); // IE < 10, PhantomJS 1.x, which is used by unit tests
	}

	/**
	 * Defines console functions for IE9 and other braindead browsers.
	 */
	static initConsole() {
		'use strict';
		if (!window.console) {
			const noOp: Function = () => {};
			(window as any).console = {
				info: noOp,
				log: noOp,
				warn: noOp,
				'error': noOp
			};
		}
	}
}
