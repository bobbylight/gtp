/**
 * Utility methods for interfacing with browser APIs.  This stuff is
 * typically hard to unit test, and thus is in this class so it is easily
 * mockable.
 */
export default {

	/**
	 * Returns <code>window.location.search</code>.
	 */
	getWindowLocationSearch(): string {
		return window.location.search;
	},
};
