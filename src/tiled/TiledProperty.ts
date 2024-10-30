export type TiledPropertyType = 'string' | 'float' | 'int' | 'bool' | 'file' | 'color' | 'object' | 'class';

/**
 * A custom property on a tiled object or map.
 */
export default interface TiledProperty {
	name: string;
	type: TiledPropertyType;
	propertytype?: string;
	value: any;
}
