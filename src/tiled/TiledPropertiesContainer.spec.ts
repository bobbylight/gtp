import TiledPropertiesContainer, { getProperty, initPropertiesByName } from './TiledPropertiesContainer';
import TiledProperty from './TiledProperty';

describe('TiledPropertiesContainer', () => {

	let object: TiledPropertiesContainer;

	beforeEach(() => {

		object = {
			properties: [
				{
					name: 'foo',
					type: 'string',
					value: 'value',
				},
				{
					name: 'bar',
					type: 'int',
					value: 42,
				},
			],
			propertiesByName: new Map<String, TiledProperty>(),
		};

	});

	describe('getProperty()', () => {

		it('returns the expected value in the happy path', () => {
			initPropertiesByName(object);
			expect(getProperty(object, 'foo')).toBe(object.properties![0].value);
		});

		it('returns the default value if one is specified and the property is not defined', () => {
			initPropertiesByName(object);
			expect(getProperty(object, 'unknown', false)).toBe(false);
		});

		it('throws an error if the property is not defined and there is no default', () => {
			expect(() => getProperty(object, 'unknown')).toThrowError();
		});
	});

	describe('initPropertiesByName()', () => {

		it('works in the happy path', () => {

			initPropertiesByName(object);

			expect(object.propertiesByName.get('foo')).toBe(object.properties![0]);
			expect(object.propertiesByName.get('bar')).toBe(object.properties![1]);
		})
	});
})
