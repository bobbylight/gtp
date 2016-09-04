var gtp;
(function (gtp) {
    'use strict';
    /**
     * An object pool.	Useful if your game creates lots of very small
     * objects of the same type each frame, such as a path-finding algorithm.
     * <p>
     * NOTE: The <code>returnObj()</code> method may take linear time;
     * it's much more efficient to use <code>reset()</code> if possible.
     */
    var Pool = (function () {
        /**
         * Creates an object pool.
         * @param {Function} ctorFunc The constructor function for <code>T</code>
         *        instances.
         * @param {number} initialSize The initial size of the pool; defaults to
         *        <code>20</code>.
         * @param {number} growCount The amount to grow this pool by if too many
         *        objects are borrowed; defaults to <code>10</code>.
         */
        function Pool(ctorFunc, initialSize, growCount) {
            if (initialSize === void 0) { initialSize = 20; }
            if (growCount === void 0) { growCount = 10; }
            this._c = ctorFunc;
            this._pool = [];
            for (var i = 0; i < initialSize; i++) {
                this._pool.push(new this._c());
            }
            this._index = 0;
            this._growCount = growCount;
        }
        /**
         * Gets an object from this pool.
         * @return {T} An object from this pool.
         * @see returnObj
         * @see returnObj
         */
        Pool.prototype.borrowObj = function () {
            var obj = this._pool[this._index++];
            if (this._index >= this._pool.length) {
                for (var i = 0; i < this._growCount; i++) {
                    this._pool.push(new this._c());
                }
            }
            return obj;
        };
        Object.defineProperty(Pool.prototype, "borrowedCount", {
            /**
             * Returns the number of currently-borrowed objects.
             * @return {number} The number of currently-borrowed objects.
             */
            get: function () {
                return this._index;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Acts as if all objects have been returned to this pool.	This method
         * should be used if you're implementing an algorithm that uses an
         * arbitrary number of objects, and just want to return them all when you
         * are done.
         * @see returnObj
         */
        Pool.prototype.reset = function () {
            this._index = 0;
        };
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
        Pool.prototype.returnObj = function (obj) {
            // Get the index of the object being returned.
            var objIndex = -1;
            for (var i = 0; i < this._index; i++) {
                if (obj === this._pool[i]) {
                    objIndex = i;
                    break;
                }
            }
            if (objIndex === -1) {
                return false;
            }
            // Swap it with the most-recently borrowed object and move our index back
            var temp = this._pool[--this._index];
            this._pool[this._index] = this._pool[objIndex];
            this._pool[objIndex] = temp;
            return true;
        };
        Object.defineProperty(Pool.prototype, "length", {
            /**
             * Returns the total number of pooled objects, borrowed or otherwise.
             * Only really useful for debugging purposes.
             * @return {number} The total number of objects in this pool.
             */
            get: function () {
                return this._pool.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns this object as a string.	Useful for debugging.
         * @return {string} A string representation of this pool.
         */
        Pool.prototype.toString = function () {
            return '[gtp.Pool: ' +
                'borrowed=' + this.borrowedCount +
                ', size=' + this.length +
                ']';
        };
        return Pool;
    }());
    gtp.Pool = Pool;
})(gtp || (gtp = {}));

//# sourceMappingURL=Pool.js.map
