import TiledLayer from './TiledLayer';
import { TiledMapData } from './TiledMapData';
import TiledMap from './TiledMap';
import { TiledMapArgs } from './TiledMapArgs';
import AssetLoader from '../gtp/AssetLoader';
import AudioSystem from '../gtp/AudioSystem';
import { TiledLayerData } from './TiledLayerData';
import TiledTileset from './TiledTileset';
import TiledObject from './TiledObject';

const TEST_TILE_LAYER_NAME = 'test-tile-layer';
const TEST_OBJECT_GROUP_LAYER_NAME = 'test-object-group-layer';
const TEST_OBJECT_1_NAME = 'test-object-1';

describe('TiledLayer', () => {

	let tileLayer: TiledLayer;
	let objectGroupLayer: TiledLayer;

	beforeEach(() => {

		const layerData: TiledLayerData = {
			chunks: [],
			compression: 'zstd',
			data: [ 1, 2, 3, 4 ],
			height: 2,
			id: 1,
			image: 'test-image.png',
			name: TEST_TILE_LAYER_NAME,
			offsetx: 0,
			offsety: 0,
			opacity: 1,
			properties: [
				{
					name: 'test-property-1',
					type: 'string',
					value: 'foo',
				},
			],
			type: 'tilelayer',
			visible: true,
			width: 2,
			x: 0,
			y: 0,
		};

		const objectGroupLayerData: TiledLayerData = {
			chunks: [],
			compression: 'zstd',
			height: 2,
			id: 1,
			image: 'test-image.png',
			name: TEST_OBJECT_GROUP_LAYER_NAME,
			objects: [
				{
					id: 1,
					name: TEST_OBJECT_1_NAME,
					x: 4,
					y: 4,
					width: 2,
					height: 2,
				} as TiledObject,
			],
			offsetx: 0,
			offsety: 0,
			opacity: 1,
			properties: [],
			type: 'objectgroup',
			visible: true,
			width: 2,
			x: 0,
			y: 0,
		};

		const mapData: TiledMapData = {
			layers: [ layerData, objectGroupLayerData ],
			tilesets: [] as TiledTileset[],
		} as TiledMapData;

		const mapArgs: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets: new AssetLoader(1, new AudioSystem()),
		};
		const map: TiledMap = new TiledMap(mapData, mapArgs);

		tileLayer = map.getLayer(TEST_TILE_LAYER_NAME);
		objectGroupLayer = map.getLayer(TEST_OBJECT_GROUP_LAYER_NAME);
	});

	describe('getData()', () => {

		it('returns the expected value in the happy path', () => {
			expect(tileLayer.getData(1, 1)).toEqual(tileLayer.data![3]);
		});

		it('returns -1 if this is not a data layer', () => {
			expect(objectGroupLayer.getData(1, 1)).toEqual(-1);
		});
	});

	describe('setData()', () => {

		it('sets the expected value in the happy path', () => {
			expect(tileLayer.setData(1, 1, 42)).toBeTruthy();
			expect(tileLayer.getData(1, 1)).toEqual(42);
		});

		it('false if this is not a data layer', () => {
			expect(objectGroupLayer.setData(1, 1, 42)).toBeFalsy();
			expect(objectGroupLayer.getData(1, 1)).toEqual(-1);
		});
	});

	describe('getObjectByName()', () => {

		it('returns the object if an objectgroup', () => {
			const object: TiledObject | undefined = objectGroupLayer.getObjectByName(TEST_OBJECT_1_NAME);
			expect(object).toBeDefined();
			expect(object?.name).toEqual(TEST_OBJECT_1_NAME);
		});

		it('returns undefined if not an objectgroup', () => {
			const object: TiledObject | undefined = tileLayer.getObjectByName(TEST_OBJECT_1_NAME);
			expect(object).toBeUndefined();
		});
	});

	describe('getObjectIntersecting()', () => {

		it('returns the object if an objectgroup', () => {
			const object: TiledObject | undefined = objectGroupLayer.getObjectIntersecting(5, 5, 1, 1);
			expect(object).toBeDefined();
			expect(object?.name).toEqual(TEST_OBJECT_1_NAME);
		});

		it('returns undefined if not an objectgroup', () => {
			const object: TiledObject | undefined = tileLayer.getObjectIntersecting(5, 5, 1, 1);
			expect(object).toBeUndefined();
		});
	});

	describe('getProperty()', () => {

		it('returns a value in the happy path', () => {
			expect(tileLayer.getProperty('test-property-1')).toBeDefined();
		});

		it('returns the default value if one is specified and the property is not defined', () => {
			expect(tileLayer.getProperty('unknown', false)).toBe(false);
		});

		it('throws an error if the property requested is not defined and there is no default', () => {
			expect(() => tileLayer.getProperty('unknown')).toThrow();
		});
	});

	describe('isObjectGroup()', () => {

		it('returns true for objectgroups', () => {
			expect(objectGroupLayer.isObjectGroup()).toBeTruthy();
		});

		it('return falsae for non-objectgroups', () => {
			expect(tileLayer.isObjectGroup()).toBeFalsy();
		});
	});
});
