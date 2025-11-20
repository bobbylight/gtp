import ImageAtlas, { ImageAtlasInfo, ImageMap } from './ImageAtlas.js';

describe('ImageAtlas', () => {

	it('parse() works for valid image, x, y, w, h', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					x: 0,
					y: 0,
					w: 16,
					h: 16,
				},
			],
		};

		const imageInfos: ImageMap = new ImageAtlas(canvas, atlasInfo).parse();
		expect(Object.keys(imageInfos).length).toBe(1);
	});

	it('parse() fails if x missing', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					y: 0,
					w: 16,
					h: 16,
				},
			],
		};

		expect(() => { new ImageAtlas(canvas, atlasInfo).parse(); }).toThrow();
	});

	it('parse() fails if y missing', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					x: 0,
					w: 16,
					h: 16,
				},
			],
		};

		expect(() => { new ImageAtlas(canvas, atlasInfo).parse(); }).toThrow();
	});

	it('parse() fails if w missing', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					x: 0,
					y: 0,
					h: 16,
				},
			],
		};

		expect(() => { new ImageAtlas(canvas, atlasInfo).parse(); }).toThrow();
	});

	it('parse() fails if h missing', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					x: 0,
					y: 0,
					w: 16,
				},
			],
		};

		expect(() => { new ImageAtlas(canvas, atlasInfo).parse(); }).toThrow();
	});

	it('parse() works for valid image, dim with spaces', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					dim: '0, 0, 16, 16',
				},
			],
		};

		const imageInfos: ImageMap = new ImageAtlas(canvas, atlasInfo).parse();
		expect(Object.keys(imageInfos).length).toBe(1);
	});

	it('parse() works for valid image, dim without spaces', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					dim: '0,0,16,16',
				},
			],
		};

		const imageInfos: ImageMap = new ImageAtlas(canvas, atlasInfo).parse();
		expect(Object.keys(imageInfos).length).toBe(1);
	});

	it('parse() fails if dim contains < 4 numbers', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					dim: '0,0,16',
				},
			],
		};

		expect(() => { new ImageAtlas(canvas, atlasInfo).parse(); }).toThrow();
	});

	it('parse() fails if dim contains > 4 numbers', () => {

		const canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.width = 40;
		canvas.height = 50;

		const atlasInfo: ImageAtlasInfo = {
			firstPixelIsTranslucent: true,
			images: [
				{
					id: 'img1',
					dim: '0,0,16,16,16',
				},
			],
		};

		expect(() => { new ImageAtlas(canvas, atlasInfo).parse(); }).toThrow();
	});
});
