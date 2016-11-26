export class TiledTileset {

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

	constructor(data: any, imagePathModifier?: Function) {
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
