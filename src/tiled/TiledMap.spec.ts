import TiledMap from './TiledMap';
import TiledLayer from './TiledLayer';
import { TiledMapData } from './TiledMapData';
import Image from '../gtp/Image';

const simpleMapData: TiledMapData = {
	width: 2,
	height: 3,
	layers: [
		{
			name: 'layer-1',
			width: 2,
			height: 2,
			opacity: 1,
			visible: true,
			x: 0,
			y: 0,
			data: [ 1, 1, 1, 1 ]
		},
		{
			name: 'layer-2',
			width: 2,
			height: 2,
			opacity: 1,
			visible: true,
			x: 0,
			y: 0,
			data: [ 2, 2, 2, 2 ]
		},
		{
			name: 'layer-3',
			width: 2,
			height: 2,
			opacity: 1,
			visible: true,
			x: 0,
			y: 0,
			data: [ 3, 3, 3, 3 ],
		},
	],
	tilesets: [
		{
		},
	],
	properties: [
		{
			name: 'property-1',
			type: 'int',
			value: 5,
		},
	],
	version: 1,
	orientation: 'not-sure',
};

describe('TiledMap', () => {

	it('constructor adds the proper number of layers, tilesets and properties', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 2,
			screenHeight: 2,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);

		// Validate layers
		expect(tiledMap.layers.length).toEqual(3);
		tiledMap.layers.forEach((layer: TiledLayer, index: number) => {
			expect(layer.data[0]).toEqual(index + 1);
		});

		// Validate tilesets
		expect(tiledMap.tilesets.length).toEqual(1);

		// Validate properties
		expect(tiledMap.properties.length).toEqual(1);
		expect(tiledMap.propertiesByName['property-1'].value).toEqual(5);
	});

	it('draw() renders the map', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 1,
			screenHeight: 1,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);

		const mockImage: Image = {
			drawScaled2: jest.fn(),
		} as unknown as Image;

		(window as any).game = {
			assets: {
				getTmxTilesetImage: () => {
					return mockImage;
				},
			},
		};

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
		tiledMap.draw(ctx, 1, 1);
		expect(mockImage.drawScaled2).toHaveBeenCalled();
	});

	it('getLayer() works properly', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 1,
			screenHeight: 1,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getLayer('layer-1')).toBeDefined();
		expect(tiledMap.getLayer('unknown')).not.toBeDefined();
	});

	it('getLayerByIndex() works properly', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 1,
			screenHeight: 1,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getLayerByIndex(0)).toBeDefined();
		expect(tiledMap.getLayerByIndex(999)).not.toBeDefined();
	});

	it('getLayerCount() works properly', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 1,
			screenHeight: 1,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getLayerCount()).toEqual(3);
	});

	it('getProperty() works properly', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 1,
			screenHeight: 1,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getProperty('property-1')).toEqual(5);
		expect(tiledMap.getProperty('unknown')).toBeNull();
	});

	it('getPixelHeight() works properly', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 2,
			screenHeight: 3,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getPixelHeight()).toEqual(48);
	});

	it('getPixelWidth() works properly', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 2,
			screenHeight: 3,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getPixelWidth()).toEqual(32);
	});

	it('removeLayer() works properly', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 2,
			screenHeight: 2,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.removeLayer('layer-1')).toBeTruthy();
		expect(tiledMap.removeLayer('layer-1')).toBeFalsy();
		expect(tiledMap.removeLayer('unknown')).toBeFalsy();
	});
});
