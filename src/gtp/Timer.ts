module gtp {
	'use strict';

	/**
	 * A mapping from string keys to numbers.  Used to map named events to their
	 * run times.
	 */
	interface TimeMap {
		[key: string]: number;
	}

	export class Timer {

		private _startTimes: TimeMap = {};
		private _prefix: string = 'DEBUG';

		/**
		 * Allows you to time actions and log their runtimes to the console.
		 * @constructor
		 */
		constructor() {
		}

		/**
		 * Sets the prefix to prepend to each line printed to the console.
		 * 
		 * @param {String} prefix The new prefix.  'DEBUG' is used if not defined.
		 */
		setLogPrefix(prefix: string = 'DEBUG') {
			this._prefix = prefix;
		}
   
		/**
		 * Starts timing something.
		 * 
		 * @param {String} key A unique key for the thing being timed.
		 */
		start(key: string) {
			this._startTimes[key] = new Date().getTime();
		}
   
		/**
		 * Stops timing something.
		 * 
		 * @param {String} key The key of the thing being timed.
		 */
		end(key: string) {
			var start: number = this._startTimes[key];
			if (!start) {
				console.error('Cannot end timer for "' + key + '" as it was never started');
				return -1;
			}
			var time: number = new Date().getTime() - start;
			delete this._startTimes[key];
			return time;
		}
   
		/**
		 * Stops timing something and logs its runtime to the console.
		 * 
		 * @param {String} key The key of the thing being timed.
		 */
		endAndLog(key: string) {
			var time: number = this.end(key);
			if (time > -1) {
				console.log(this._prefix + ': ' + key + ': ' + time + ' ms');
			}
		}
   

	}
}