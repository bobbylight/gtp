declare module gtp {
    /**
     * An object pool.	Useful if your game creates lots of very small
     * objects of the same type each frame, such as a path-finding algorithm.
     * <p>
     * NOTE: The <code>returnObj()</code> method may take linear time;
     * it's much more efficient to use <code>reset()</code> if possible.
     */
    class Pool<T> {
        private _pool;
        private _index;
        private _growCount;
        private _c;
        /**
         * Creates an object pool.
         * @param {Function} ctorFunc The constructor function for <code>T</code>
         *        instances.
         * @param {number} initialSize The initial size of the pool; defaults to
         *        <code>20</code>.
         * @param {number} growCount The amount to grow this pool by if too many
         *        objects are borrowed; defaults to <code>10</code>.
         */
        constructor(ctorFunc: {
            new (): T;
        }, initialSize?: number, growCount?: number);
        /**
         * Gets an object from this pool.
         * @return {T} An object from this pool.
         * @see returnObj
         * @see returnObj
         */
        borrowObj(): T;
        /**
         * Returns the number of currently-borrowed objects.
         * @return {number} The number of currently-borrowed objects.
         */
        readonly borrowedCount: number;
        /**
         * Acts as if all objects have been returned to this pool.	This method
         * should be used if you're implementing an algorithm that uses an
         * arbitrary number of objects, and just want to return them all when you
         * are done.
         * @see returnObj
         */
        reset(): void;
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
        returnObj(obj: T): boolean;
        /**
         * Returns the total number of pooled objects, borrowed or otherwise.
         * Only really useful for debugging purposes.
         * @return {number} The total number of objects in this pool.
         */
        readonly length: number;
        /**
         * Returns this object as a string.	Useful for debugging.
         * @return {string} A string representation of this pool.
         */
        toString(): string;
    }
}
