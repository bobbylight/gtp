import TiledProperty from './TiledProperty';

export function getProperty<T>(container: TiledPropertiesContainer, name: string, defaultValue?: T): T {
	const result: TiledProperty | undefined = container.propertiesByName.get(name);
	if (!result) {
		if (typeof defaultValue !== 'undefined') {
			return defaultValue;
		}
		throw new Error(`No such property on object, or named properties not initialized: ${name}`);
	}
	return result.value as T;
}

export function initPropertiesByName(container: TiledPropertiesContainer) {
	container.propertiesByName = new Map<string, TiledProperty>();
	container.properties?.forEach((property: TiledProperty) => {
		container.propertiesByName.set(property.name, property);
	});
}

/**
 * An interface defining methods on a Tiled object with properties.
 */
export default interface TiledPropertiesContainer {
	properties?: TiledProperty[];
	propertiesByName: Map<string, TiledProperty>;
}
