/**
 * A map from keys to objects of some type.
 */
export default interface TypedMap<T> {
	[ key: string ]: T;
}
