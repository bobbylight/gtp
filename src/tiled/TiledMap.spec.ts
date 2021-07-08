import TiledMap from './TiledMap';
import TiledLayer from './TiledLayer';

const simpleMapData: any = {
	width: 2,
	height: 2,
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
	]
};

describe('TiledMap', () => {

	it('constructor adds the proper number of layers', () => {

		const args: any = {
			tileWidth: 16,
			tileHeight: 16,
			screenWidth: 2,
			screenHeight: 2,
		};

		const tiledMap: TiledMap = new TiledMap(simpleMapData, args);
		expect(tiledMap.layers.length).toEqual(3);
		tiledMap.layers.forEach((layer: TiledLayer, index: number) => {
			expect(layer.data[0]).toEqual(index + 1);
		});
	});
});
