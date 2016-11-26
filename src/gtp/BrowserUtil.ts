/**
 * Utility methods for interfacing with browser APIs.  This stuff is
 * typically hard to unit test, and thus is in this class so it is easily
 * mockable.
 *
 * @constructor
 */
export class BrowserUtil {

	/**
	 * Returns <code>window.location.search</code>.
	 */
	static getWindowLocationSearch(): string {
		return window.location.search;
	}
}
