import TiledProperty, { TiledPropertyType } from './TiledProperty';

export function getProperty<T extends TiledPropertyType>(container: TiledPropertiesContainer, name: string): T {
	const result: TiledProperty | undefined = container.propertiesByName.get(name);
	if (!result) {
		throw new Error(`No such property on object: ${name}`);
	}
	return result.value;
}

export function initPropertiesByName(container: TiledPropertiesContainer) {
	container.propertiesByName = new Map<String, TiledProperty>();
	container.properties?.forEach((property: TiledProperty) => {
		container.propertiesByName.set(property.name, property);
	});
}

/**
 * An interface defining methods on a Tiled object with properties.
 */
export default interface TiledPropertiesContainer {
	properties?: TiledProperty[];
	propertiesByName: Map<String, TiledProperty>;
}
