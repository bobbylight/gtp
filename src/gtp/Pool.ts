/**
 * An object pool.	Useful if your game creates lots of very small
 * objects of the same type each frame, such as a path-finding algorithm.
 * <p>
 * NOTE: The <code>returnObj()</code> method may take linear time;
 * it's much more efficient to use <code>reset()</code> if possible.
 */
export default class Pool<T> {

	private _pool: T[];
	private _index: number;
	private _growCount: number;
	private _c: { new(): T };

	/**
	 * Creates an object pool.
	 * @param {Function} ctorFunc The constructor function for <code>T</code>
	 *        instances.
	 * @param {number} initialSize The initial size of the pool; defaults to
	 *        <code>20</code>.
	 * @param {number} growCount The amount to grow this pool by if too many
	 *        objects are borrowed; defaults to <code>10</code>.
	 */
	constructor(ctorFunc: { new(): T }, initialSize: number = 20,
				growCount: number = 10) {
		this._c = ctorFunc;
		this._pool = [];
		for (let i: number = 0; i < initialSize; i++) {
			this._pool.push(new this._c());
		}
		this._index = 0;
		this._growCount = growCount;
	}

	/**
	 * Gets an object from this pool.
	 * @return {T} An object from this pool.
	 * @see returnObj
	 */
	borrowObj(): T {
		let obj: T = this._pool[this._index++];
		if (this._index >= this._pool.length) {
			for (let i: number = 0; i < this._growCount; i++) {
				this._pool.push(new this._c());
			}
		}
		return obj;
	}

	/**
	 * Returns the number of currently-borrowed objects.
	 * @return {number} The number of currently-borrowed objects.
	 */
	get borrowedCount(): number {
		return this._index;
	}

	/**
	 * Acts as if all objects have been returned to this pool.	This method
	 * should be used if you're implementing an algorithm that uses an
	 * arbitrary number of objects, and just want to return them all when you
	 * are done.
	 * @see returnObj
	 */
	reset() {
		this._index = 0;
	}

	/**
	 * Returns an object to this pool.
	 * @param {T} obj The object to return.
	 * @return {boolean} <code>true</code>, assuming the object was actually
	 *         from this pool, and not previously returned.	In other words,
	 *         this method will only return <code>false</code> if you try to
	 *         incorrectly return an object.
	 * @see borrowObj
	 * @see reset
	 */
	returnObj(obj: T): boolean {

		// Get the index of the object being returned.
		let objIndex: number = -1;
		for (let i: number = 0; i < this._index; i++) {
			if (obj === this._pool[i]) {
				objIndex = i;
				break;
			}
		}

		if (objIndex === -1) {
			return false;
		}

		// Swap it with the most-recently borrowed object and move our index back
		let temp: T = this._pool[--this._index];
		this._pool[this._index] = this._pool[objIndex];
		this._pool[objIndex] = temp;

		return true;
	}

	/**
	 * Returns the total number of pooled objects, borrowed or otherwise.
	 * Only really useful for debugging purposes.
	 * @return {number} The total number of objects in this pool.
	 */
	get length(): number {
		return this._pool.length;
	}

	/**
	 * Returns this object as a string.	Useful for debugging.
	 * @return {string} A string representation of this pool.
	 */
	toString(): string {
		return '[Pool: ' +
				`borrowed=${this.borrowedCount}, ` +
				`size=${this.length}` +
				']';
	}
}
