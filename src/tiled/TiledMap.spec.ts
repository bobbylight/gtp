import TiledMap from './TiledMap';
import TiledLayer from './TiledLayer';
import { TiledMapData } from './TiledMapData';
import Image from '../gtp/Image';
import TiledTileset from './TiledTileset';
import { TiledMapArgs } from './TiledMapArgs';
import AssetLoader from '../gtp/AssetLoader';
import AudioSystem from '../gtp/AudioSystem';

const simpleMapData: TiledMapData = {
	compressionlevel: -1,
	height: 3,
	infinite: false,
	layers: [
		{
			data: [ 1, 1, 1, 1 ],
			id: 1,
			height: 2,
			name: 'layer-1',
			opacity: 1,
			type: 'tilelayer',
			visible: true,
			width: 2,
			x: 0,
			y: 0,
		},
		{
			data: [ 2, 2, 2, 2 ],
			id: 2,
			height: 2,
			name: 'layer-2',
			opacity: 1,
			type: 'tilelayer',
			visible: true,
			width: 2,
			x: 0,
			y: 0,
		},
		{
			data: [ 3, 3, 3, 3 ],
			id: 3,
			height: 2,
			name: 'layer-3',
			opacity: 1,
			type: 'tilelayer',
			visible: true,
			width: 2,
			x: 0,
			y: 0,
		},
	],
	nextlayerid: 4,
	nextobjectid: 1,
	orientation: 'orthogonal',
	properties: [
		{
			name: 'property-1',
			type: 'int',
			value: 5,
		},
	],
	renderorder: 'right-down',
	tiledversion: '1.8.3',
	tileheight: 16,
	tilewidth: 16,
	tilesets: [
		{
			firstgid: 1,
			source: 'test-tiles.json',
		} as TiledTileset,
	],
	type: 'map',
	version: '1.8',
	width: 2,
};

describe('TiledMap', () => {

	it('constructor adds the proper number of layers, tilesets and properties', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
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
		expect(tiledMap.properties?.length).toEqual(1);
		expect(tiledMap.propertiesByName?.get('property-1')?.value).toEqual(5);
	});

	it('draw() renders the map', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
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

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getLayer('layer-1')).toBeDefined();
		expect(tiledMap.getLayer('unknown')).not.toBeDefined();
	});

	it('getLayerByIndex() works properly', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getLayerByIndex(0)).toBeDefined();
		expect(tiledMap.getLayerByIndex(999)).not.toBeDefined();
	});

	it('getLayerCount() works properly', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getLayerCount()).toEqual(3);
	});

	it('getProperty() works properly', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getProperty('property-1')).toEqual(5);
		expect(tiledMap.getProperty('unknown')).toBeUndefined();
	});

	it('getPixelHeight() works properly', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getPixelHeight()).toEqual(48);
	});

	it('getPixelWidth() works properly', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.getPixelWidth()).toEqual(32);
	});

	it('removeLayer() works properly', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.removeLayer('layer-1')).toBeTruthy();
		expect(tiledMap.removeLayer('layer-1')).toBeFalsy();
		expect(tiledMap.removeLayer('unknown')).toBeFalsy();
	});

	it('setScale() works properly', () => {

		const assets: AssetLoader = new AssetLoader(1, new AudioSystem(), '');
		assets.set('test-tiles.json', {});
		const args: TiledMapArgs = {
			screenWidth: 2,
			screenHeight: 2,
			assets,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		const origTileWidth: number = tiledMap.tilewidth;
		const origTileHeight: number = tiledMap.tileheight;

		tiledMap.setScale(3);
		expect(tiledMap.tilewidth).toEqual(origTileWidth * 3);
		expect(tiledMap.tileheight).toEqual(origTileHeight * 3);
	});
});
