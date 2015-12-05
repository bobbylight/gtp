module gtp {
	'use strict';

	/**
	 * Obligatory utility methods for games.
	 * @constructor
	 */
	export class Utils {

		/**
		 * Returns the number of elements in an object.
		 * 
		 * @param {object} obj The object.
		 * @return {int} The number of elements in the object.
		 */
		static getObjectSize(obj: Object): number {
			var size = 0;
			for (var key in obj) {
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
		static getRequestParam(param: string): string {

			// Replace leading '?' with '&'
			var params = '&' + gtp.BrowserUtil.getWindowLocationSearch().substring(1);

			var searchFor = '&' + param;
			var index = params.indexOf(searchFor);
			if (index >= -1) {
				var start = index + searchFor.length;
				if (params.charAt(start) === '=') {
					start++;
					var end = params.indexOf('&', start); // &foo=val1&bar=val2
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
		 * Equivlaent to dojo/_base/hitch, returns a function in a specific scope.
		 * 
		 * @param {object} scope The scope to run the function in (e.g. the value of
		 *        "this").
		 * @param {function} func The function.
		 * @return {function} A function that does the same thing as 'func', but in the
		 *         specified scope.
		 */
		static hitch(scope: any, func: Function) : Function {
			return function() {
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
			for (var prop in source) {
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
		 * @param {int} [max] The maximum possible value, exclusive.
		 * @return {int} The random integer value.
		 */
		static randomInt(min: number = 0, max: number) : number {
			'use strict';
			// Using Math.round() will give you a non-uniform distribution!
			return Math.floor(Math.random() * (max - min)) + min;
		}

		/** 
		 * Defines console functions for IE9 and other braindead browsers.
		 */
		static initConsole() {
			'use strict';
			if (!window.console) {
				var noOp = function() { };
				window.console = <any>{
					log: noOp,
					warn: noOp,
					error: noOp
				};
			}
		}
	}
}