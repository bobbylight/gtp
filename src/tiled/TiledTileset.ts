/**
 * A function that modifies a file path (for example, prepends a root directory to it).
 */
export interface ImagePathModifier {
	(path: string): string;
}

/**
 * A tile set used in a <code>Tiled</code> map.
 */
export default class TiledTileset {

	firstgid: number;
	image: string;
	imageWidth: number;
	imageHeight: number;
	margin: number;
	name: string;
	properties: {};
	spacing: number;
	tileWidth: number;
	tileHeight: number;

	constructor(data: any, imagePathModifier?: ImagePathModifier) {
		this.firstgid = data.firstgid;
		this.image = data.image;
		if (imagePathModifier) {
			this.image = imagePathModifier(this.image);
		}
		this.imageWidth = data.imagewidth;
		this.imageHeight = data.imageheight;
		this.margin = data.margin;
		this.name = data.name;
		this.properties = data.properties; // TODO
		this.spacing = data.spacing;
		this.tileWidth = data.tilewidth;
		this.tileHeight = data.tileheight;
	}

	setScale(scale: number) {
		this.imageWidth *= scale;
		this.imageHeight *= scale;
		this.tileWidth *= scale;
		this.tileHeight *= scale;
		this.margin *= scale;
		this.spacing *= scale;
	}
}
