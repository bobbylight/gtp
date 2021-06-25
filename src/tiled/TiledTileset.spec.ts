import { TiledTileset, ImagePathModifier } from '../index';

describe('TiledTileset', () => {

	const imageModifier: ImagePathModifier = (path: string): string => {
		return `/prepended${path}`;
	};

	it('constructor happy path', () => {

		const data: any = {
			firstgid: 4,
			image: '/path/to/image.png',
			imagewidth: 22,
			imageheight: 33,
			margin: 44,
			name: 'foo',
			properties: {},
			spacing: 55,
			tilewidth: 66,
			tileheight: 77
		};
		const tileset: TiledTileset = new TiledTileset(data, imageModifier);

		expect(tileset.firstgid).toBe(data.firstgid);
		expect(tileset.image).toBe(imageModifier(data.image));
		expect(tileset.imageWidth).toBe(data.imagewidth);
		expect(tileset.imageHeight).toBe(data.imageheight);
		expect(tileset.margin).toBe(data.margin);
		expect(tileset.name).toBe(data.name);
		expect(tileset.properties).toBeDefined();
		expect(tileset.spacing).toBe(data.spacing);
		expect(tileset.tileWidth).toBe(data.tilewidth);
		expect(tileset.tileHeight).toBe(data.tileheight);
	});

	it('setScale() happy path', () => {

		const data: any = {
			imagewidth: 22,
			imageheight: 33,
			margin: 44,
			spacing: 55,
			tilewidth: 66,
			tileheight: 77
		};
		const tileset: TiledTileset = new TiledTileset(data, imageModifier);

		const SCALE: number = 4;
		tileset.setScale(SCALE);
		expect(tileset.imageWidth).toBe(data.imagewidth * SCALE);
		expect(tileset.imageHeight).toBe(data.imageheight * SCALE);
		expect(tileset.margin).toBe(data.margin * SCALE);
		expect(tileset.spacing).toBe(data.spacing * SCALE);
		expect(tileset.tileWidth).toBe(data.tilewidth * SCALE);
		expect(tileset.tileHeight).toBe(data.tileheight * SCALE);
	});
});
