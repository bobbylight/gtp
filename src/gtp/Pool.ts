/**
 * An object pool.	Useful if your game creates lots of very small
 * objects of the same type each frame, such as a path-finding algorithm.
 * <p>
 * NOTE: The <code>returnObj()</code> method may take linear time;
 * it's much more efficient to use <code>reset()</code> if possible.
 */
export default class Pool<T> {

	private readonly pool: T[];
	private index: number;
	private readonly growCount: number;
	private readonly c: new() => T;

	/**
	 * Creates an object pool.
	 * @param ctorFunc The constructor function for <code>T</code>
	 *        instances.
	 * @param initialSize The initial size of the pool; defaults to
	 *        <code>20</code>.
	 * @param growCount The amount to grow this pool by if too many
	 *        objects are borrowed; defaults to <code>10</code>.
	 */
	constructor(ctorFunc: new() => T, initialSize= 20, growCount= 10) {
		this.c = ctorFunc;
		this.pool = [];
		for (let i= 0; i < initialSize; i++) {
			this.pool.push(new this.c());
		}
		this.index = 0;
		this.growCount = growCount;
	}

	/**
	 * Gets an object from this pool.
	 * @return An object from this pool.
	 * @see returnObj
	 */
	borrowObj(): T {
		const obj: T = this.pool[this.index++];
		if (this.index >= this.pool.length) {
			for (let i= 0; i < this.growCount; i++) {
				this.pool.push(new this.c());
			}
		}
		return obj;
	}

	/**
	 * Returns the number of currently-borrowed objects.
	 * @return The number of currently-borrowed objects.
	 */
	get borrowedCount(): number {
		return this.index;
	}

	/**
	 * Acts as if all objects have been returned to this pool.	This method
	 * should be used if you're implementing an algorithm that uses an
	 * arbitrary number of objects, and just want to return them all when you
	 * are done.
	 * @see returnObj
	 */
	reset() {
		this.index = 0;
	}

	/**
	 * Returns an object to this pool.
	 * @param obj The object to return.
	 * @return <code>true</code>, assuming the object was actually
	 *         from this pool, and not previously returned.	In other words,
	 *         this method will only return <code>false</code> if you try to
	 *         incorrectly return an object.
	 * @see borrowObj
	 * @see reset
	 */
	returnObj(obj: T): boolean {

		// Get the index of the object being returned.
		let objIndex = -1;
		for (let i= 0; i < this.index; i++) {
			if (obj === this.pool[i]) {
				objIndex = i;
				break;
			}
		}

		if (objIndex === -1) {
			return false;
		}

		// Swap it with the most-recently borrowed object and move our index back
		const temp: T = this.pool[--this.index];
		this.pool[this.index] = this.pool[objIndex];
		this.pool[objIndex] = temp;

		return true;
	}

	/**
	 * Returns the total number of pooled objects, borrowed or otherwise.
	 * Only really useful for debugging purposes.
	 * @return The total number of objects in this pool.
	 */
	get length(): number {
		return this.pool.length;
	}

	/**
	 * Returns this object as a string.	Useful for debugging.
	 * @return A string representation of this pool.
	 */
	toString(): string {
		return '[Pool: ' +
				`borrowed=${this.borrowedCount}, ` +
				`size=${this.length}` +
				']';
	}
}
