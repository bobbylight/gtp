import TiledTileset from '../tiled/TiledTileset.js';
import TiledMap from '../tiled/TiledMap.js';
import SpriteSheet from './SpriteSheet.js';
import { AssetType } from './AssetType.js';
import AudioSystem from './AudioSystem.js';
import Utils from './Utils.js';
import ImageUtils from './ImageUtils.js';
import Image from './Image.js';
import Sound from './Sound.js';
import ImageAtlas, { ImageAtlasInfo, ImageMap } from './ImageAtlas.js';

/**
 * Callback for when the asset loader completes loading everything requested.
 */
export type AssetLoaderCallback = () => void;

/**
 * Defines a type of resource we can load.
 */
interface ResourceType {
	type: AssetType;
}

/**
 * Loads resources for a game.  All games have to load resources such as
 * images, sound effects, JSON data, sprite sheets, etc.  This class provides
 * a wrapper around the loading of such resources, as well as a callback
 * mechanism to know when loading completes.  Games can use this class in a
 * "loading" state, for example.<p>
 *
 * Currently supported resources include:
 * <ul>
 *   <li>Images
 *   <li>Sound effects
 *   <li>JSON data
 *   <li>Sprite sheets
 *   <li>TMX maps
 * </ul>
 */
export default class AssetLoader {

	private readonly scale: number;
	private readonly loadingAssetData: Record<string, ResourceType>;
	private readonly responses: Record<string, any>;
	private callback: AssetLoaderCallback | undefined;
	audio: AudioSystem;
	private readonly assetRoot: string | undefined;
	private nextCallback: AssetLoaderCallback | undefined;

	/**
	 * Provides methods to load images, sounds, and Tiled maps.
	 *
	 * @param scale How much to scale image resources.
	 * @param audio A web audio context.
	 * @param [assetRoot] If specified, this is the implicit root
	 *        directory for all assets to load.  Use this if all assets are
	 *        in a subfolder or different hierarchy than the project itself.
	 */
	constructor(scale= 1, audio: AudioSystem, assetRoot?: string) {
		this.scale = scale || 1;
		this.loadingAssetData = {};
		this.responses = {};
		this.callback = undefined;
		this.audio = audio;
		this.assetRoot = assetRoot;
	}

	/**
	 * Starts loading a JSON resource.
	 * @param id The ID to use when retrieving this resource.
	 * @param [url=id] The URL of the resource, defaulting to
	 *        "id" if not specified.
	 */
	addJson(id: string, url: string = id) {

		if (this.assetRoot) {
			url = this.assetRoot + url;
		}

		if (this.isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.JSON };
		console.log(`Adding: ${id} => ${url}, ` +
			`remaining == ${Utils.getObjectSize(this.loadingAssetData)}, ` +
			`callback == ${this.callback !== null}`);

		const xhr: XMLHttpRequest = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				const response: string = xhr.responseText;
				this.completed(id, response);
			}
		};

		xhr.open('GET', url, true);
		xhr.send(null);

	}

	/**
	 * Starts loading a canvas resource.
	 * @param id The ID to use when retrieving this resource.
	 * @param imageSrc The URL of the resource.
	 */
	addCanvas(id: string, imageSrc: string) {

		if (this.assetRoot) {
			imageSrc = this.assetRoot + imageSrc;
		}

		const image: HTMLImageElement = document.createElement('img'); //new Image();
		if (this.isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.IMAGE };
		console.log(`Adding: ${id} => ${imageSrc}, ` +
			`remaining == ${Utils.getObjectSize(this.loadingAssetData)}, ` +
			`callback == ${this.callback !== null}`);
		image.addEventListener('load', () => {
			const canvas: HTMLCanvasElement = ImageUtils.resize(image, this.scale);
			this.completed(id, canvas);
		});

		image.src = imageSrc;

	}

	/**
	 * Starts loading an image resource.
	 * @param id The ID to use when retrieving this resource.
	 * @param imageSrc The URL of the resource.
	 * @param firstPixelTranslucent If truthy, the pixel at (0, 0)
	 *        is made translucent, along with all other pixels of the same
	 *        color.  The default value is <code>false</code>.
	 */
	addImage(id: string, imageSrc: string, firstPixelTranslucent= false) {

		if (this.assetRoot) {
			imageSrc = this.assetRoot + imageSrc;
		}

		const image: HTMLImageElement = document.createElement('img'); //new Image();
		if (this.isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.IMAGE };
		console.log(`Adding: ${id} => ${imageSrc}, ` +
			`remaining == ${Utils.getObjectSize(this.loadingAssetData)}, ` +
			`callback == ${this.callback !== null}`);
		image.addEventListener('load', () => {
			const canvas: HTMLCanvasElement = ImageUtils.resize(image, this.scale);
			const gtpImage: Image = new Image(canvas);
			if (firstPixelTranslucent) {
				gtpImage.makeColorTranslucent(0, 0);
			}
			this.completed(id, gtpImage);
		});

		image.src = imageSrc;

	}

	/**
	 * Starts loading all images from an image atlas.
	 * @param id A unique identifier for this image atlas (probably not used after loading completes).
	 * @param imageSrc The URL of the resource.
	 * @param atlasInfo Information about the images in the atlas to parse.
	 */
	addImageAtlasContents(id: string, imageSrc: string, atlasInfo: ImageAtlasInfo) {

		if (this.assetRoot) {
			imageSrc = this.assetRoot + imageSrc;
		}

		const image: HTMLImageElement = document.createElement('img'); //new Image();
		if (this.isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.IMAGE };
		console.log(`Adding: ${id} => ${imageSrc}, remaining == ${Utils.getObjectSize(this.loadingAssetData)}, ` +
			`callback == ${this.callback !== null}`);
		image.addEventListener('load', () => {

			const canvas: HTMLCanvasElement = ImageUtils.resize(image, this.scale);
			const atlas: ImageAtlas = new ImageAtlas(canvas, atlasInfo);

			const prefix: string = typeof atlasInfo.prefix === 'string' ? atlasInfo.prefix :
				(atlasInfo.prefix ? `${id}.` : '');

			const imageMap: ImageMap = atlas.parse();
			for (const key in imageMap) {
				if (Object.prototype.hasOwnProperty.call(imageMap, key)) {
					// Images in an atlas aren't tracked individually, but as the single atlas (see below)
					this.responses[prefix + key] = imageMap[key];
				}
			}

			this.completed(id, atlas);
		});

		image.src = imageSrc;

	}

	/**
	 * Starts loading a sound resource.
	 * @param id The ID to use when retrieving this resource.
	 * @param soundSrc The URL of the resource.
	 * @param [loopStart=0] Where to start, in seconds, if/when this
	 *        sound loops (which is typical when using a sound as music).
	 * @param [loopByDefaultIfMusic=true] Whether this sound should
	 *        loop by default when it is played as music.
	 */
	addSound(id: string, soundSrc: string, loopStart= 0,
		loopByDefaultIfMusic= true) {

		if (this.audio.isInitialized()) {

			if (this.isAlreadyTracked(id)) {
				return;
			}
			this.loadingAssetData[id] = { type: AssetType.AUDIO };

			if (this.assetRoot) {
				soundSrc = this.assetRoot + soundSrc;
			}

			const xhr: XMLHttpRequest = new XMLHttpRequest();
			xhr.onload = () => {
				// this.audio.context is definitely defined since audio initialized
				// TODO: Clean up this API
				void this.audio.context!.decodeAudioData(xhr.response as ArrayBuffer, (buffer: AudioBuffer) => {
					const sound: Sound = new Sound(id, buffer, loopStart || 0);
					sound.setLoopsByDefaultIfMusic(loopByDefaultIfMusic);
					this.audio.addSound(sound);
					this.completed(id, buffer);
				});
			};

			xhr.open('GET', soundSrc, true);
			xhr.responseType = 'arraybuffer';
			xhr.send(null);

		}

	}

	/**
	 * Starts loading a sprite sheet resource.
	 * @param id The ID to use when retrieving this resource.
	 * @param imageSrc The URL of the resource.
	 * @param cellW The width of a cell.
	 * @param cellH The height of a cell.
	 * @param spacingX The horizontal spacing between cells.  Assumed to
	 *        be 0 if not defined.
	 * @param spacingY The vertical spacing between cells.  Assumed to
	 *        be 0 if not defined.
	 * @param firstPixelTranslucent If truthy, the pixel at (0, 0)
	 *        is made translucent, along with all other pixels of the same color.
	 */
	addSpriteSheet(id: string, imageSrc: string, cellW: number, cellH: number,
		spacingX= 0, spacingY= 0,
		firstPixelTranslucent= false) {

		spacingX = spacingX || 0;
		spacingY = spacingY || 0;
		cellW *= this.scale;
		cellH *= this.scale;
		spacingX *= this.scale;
		spacingY *= this.scale;

		if (this.assetRoot) {
			imageSrc = this.assetRoot + imageSrc;
		}

		const image: HTMLImageElement = document.createElement('img'); //new Image();
		if (this.isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.IMAGE };
		console.log(`Adding: ${id} => ${imageSrc}, ` +
			`remaining == ${Utils.getObjectSize(this.loadingAssetData)}, ` +
			`callback == ${this.callback !== null}`);
		image.addEventListener('load', () => {
			const canvas: HTMLCanvasElement = ImageUtils.resize(image, this.scale);
			const gtpImage: Image = new Image(canvas);
			if (firstPixelTranslucent) {
				gtpImage.makeColorTranslucent(0, 0);
			}
			const ss: SpriteSheet = new SpriteSheet(gtpImage, cellW, cellH, spacingX, spacingY);
			this.completed(id, ss);
		});

		image.src = imageSrc;

	}

	/**
	 * Registers all images needed by the TMX map's tilesets to this asset
	 * loader.
	 *
	 * @param map The Tiled map.
	 */
	addTmxMap(map: TiledMap) {
		map.tilesets.forEach(tileset => {
			const id= `_tilesetImage_${tileset.name}`;
			this.addImage(id, tileset.image);
		});
	}

	/**
	 * Returns the image corresponding to a Tiled tileset.  This method is
	 * called by the library and is typically not called directly by the
	 * application.
	 *
	 * @param tileset The tile set.
	 * @return The tileset image.
	 */
	getTmxTilesetImage(tileset: TiledTileset): Image {
		return this.responses[`_tilesetImage_${tileset.name}`] as Image;
	}

	/**
	 * Retrieves a resource by ID.
	 * @param res The ID of the resource.
	 * @return The resource. An error is thrown if the resource isn't found.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
	get<T>(res: string): T {
		const resource: T | undefined = this.responses[res];
		if (!resource) {
			throw new Error(`Resource is not loaded: ${res}`);
		}
		return resource;
	}

	private isAlreadyTracked(id: string): boolean {
		if (this.loadingAssetData[id]) {
			console.log(`A resource with id ${id} is already loading.  Assuming they are the same`);
			return true;
		}
		if (this.responses[id]) {
			console.log(`A resource with id ${id} has already been loaded.`);
			return true;
		}
		return false;
	}

	/**
	 * Adds a resource.
	 * @param res The ID for the resource.
	 * @param value The resource value.
	 */
	set(res: string, value: any) {
		this.responses[res] = value;
	}

	private completed(res: string, response: any) {
		if (!this.loadingAssetData[res]) {
			console.error(`Resource not found! - ${res}`);
			return;
		}
		if (this.loadingAssetData[res].type === AssetType.JSON) {
			response = JSON.parse(response as string);
		}
		this.responses[res] = response;
		delete this.loadingAssetData[res];
		console.log(`Completed: ${res}, remaining == ${Utils.getObjectSize(this.loadingAssetData)}, ` +
			`callback == ${this.callback !== null}`);
		if (this.isDoneLoading() && this.callback) {
			this.callback.call(this);
			delete this.callback;
			console.log(`... Callback called and deleted (callback == ${this.callback !== null})`);
			if (this.nextCallback) {
				this.callback = this.nextCallback;
				delete this.nextCallback;
			}
		} else {
			console.log(`... Not running callback - ${this.isDoneLoading()}, ${this.callback !== null}`);
		}
	}

	/**
	 * Returns whether all assets in this loader have successfully loaded.
	 *
	 * @return Whether all assets have loaded.
	 */
	isDoneLoading(): boolean {
		return Utils.getObjectSize(this.loadingAssetData) === 0;
	}

	onLoad(callback: AssetLoaderCallback) {

		if (this.isDoneLoading()) {
			callback();
		} else if (this.callback) { // A new callback added from another callback
			this.nextCallback = callback;
		} else {
			this.callback = callback;
		}
	}

}
