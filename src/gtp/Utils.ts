import BrowserUtil from './BrowserUtil';

/**
 * Obligatory utility methods for games.
 */
export default {

	/**
	 * Returns the number of elements in an object.
	 *
	 * @param obj The object.
	 * @return The number of elements in the object.
	 */
	getObjectSize(obj: any): number {
		return Object.keys(obj).length;
	},

	/**
	 * Returns the value of a request parameter.
	 *
	 * @param param The name of the request parameter.
	 * @return The value of the request parameter, or <code>null</code>
	 *         if it was not specified.
	 */
	getRequestParam(param: string): string | null {

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
			if (params.charAt(start) === '&') {
				return ''; // &foo&bar
			}
			if (start === params.length) {
				return ''; // &foo
			}
		}
		return null;
	},

	/**
	 * Equivalent to dojo/_base/hitch, returns a function in a specific scope.
	 *
	 * @param scope The scope to run the function in (e.g. the value of
	 *        "this").
	 * @param func The function.
	 * @return A function that does the same thing as 'func', but in the
	 *         specified scope.
	 */
	// eslint-disable-next-line
	hitch(scope: any, func: Function): Function {
		// "arguments" cannot be referenced in arrow functions
		return function() {
			// eslint-disable-next-line
			func.apply(scope, arguments);
		};
	},

	/**
	 * Adds the properties of one element into another.
	 *
	 * @param source The object with properties to mix into another object.
	 * @param target The object that will receive the new properties.
	 */
	mixin(source: any, target: any) {
		for (const prop in source) {
			if (Object.prototype.hasOwnProperty.call(source, prop)) {
				//if (!target[prop]) {
				target[prop] = source[prop];
				//}
			}
		}
	},

	/**
	 * Returns a random integer between min (inclusive) and max (exclusive).  If
	 * max is omitted, the single parameter is treated as the maximum value, and
	 * an integer is returned in the range <code>0 - value</code>.
	 *
	 * @param [min=0] The minimum possible value, inclusive.
	 * @param max The maximum possible value, exclusive.
	 * @return The random integer value.
	 */
	randomInt(min: number, max?: number): number {
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
	},

	/**
	 * Returns a time in milliseconds.  This will be high resolution, if
	 * possible.  This method should be used to implement constructs like
	 * delays.
	 * @return A time, in milliseconds.
	 */
	timestamp(): number {
		if (window.performance?.now) {
			return window.performance.now();
		}
		return Date.now(); // IE < 10
	},

	/**
	 * Defines console functions for IE9 and other braindead browsers.
	 */
	initConsole() {
			if (!window.console) {
			const noOp = () => {};
			(window as any).console = {
				info: noOp,
				log: noOp,
				warn: noOp,
				'error': noOp,
			};
		}
	},
};
