declare module gtp {
    /**
     * Obligatory utility methods for games.
     * @constructor
     */
    class Utils {
        /**
         * Returns the number of elements in an object.
         *
         * @param {object} obj The object.
         * @return {int} The number of elements in the object.
         */
        static getObjectSize(obj: Object): number;
        /**
         * Returns the value of a request parameter.
         *
         * @param {string} param The name of the request parameter.
         * @return {string} The value of the request parameter, or <code>null</code>
         *         if it was not specified.
         */
        static getRequestParam(param: string): string;
        /**
         * Equivlaent to dojo/_base/hitch, returns a function in a specific scope.
         *
         * @param {object} scope The scope to run the function in (e.g. the value of
         *        "this").
         * @param {function} func The function.
         * @return {function} A function that does the same thing as 'func', but in the
         *         specified scope.
         */
        static hitch(scope: any, func: Function): Function;
        /**
         * Adds the properties of one element into another.
         *
         * @param {object} source The object with properties to mix into another object.
         * @param {object} target The object that will receive the new properties.
         */
        static mixin(source: any, target: any): void;
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
        /**
         * Returns a time in milliseconds.  This will be high resolution, if
         * possible.  This method should be used to implement constructs like
         * delays.
         * @return {number} A time, in milliseconds.
         */
        static timestamp(): number;
        /**
         * Defines console functions for IE9 and other braindead browsers.
         */
        static initConsole(): void;
    }
}
