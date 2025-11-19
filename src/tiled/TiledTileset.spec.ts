import TiledTileset, { scaleTileset } from './TiledTileset';

describe('TiledTileset', () => {

	describe('scaleTileset', () => {

		it('scales a tileset as expected', () => {

			const tileset = {
				imagewidth: 2,
				imageheight: 3,
				tilewidth: 4,
				tileheight: 5,
				margin: 6,
				spacing: 7,
			} as TiledTileset;

			scaleTileset(tileset, 2);

			expect(tileset.imagewidth).toBe(4);
			expect(tileset.imageheight).toBe(6);
			expect(tileset.tilewidth).toBe(8);
			expect(tileset.tileheight).toBe(10);
			expect(tileset.margin).toBe(12);
			expect(tileset.spacing).toBe(14);
		});
	});
});
