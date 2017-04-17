import SpriteSheet from './SpriteSheet';
import {AssetType} from './AssetType';
import AudioSystem from './AudioSystem';
import Utils from './Utils';
import ImageUtils from './ImageUtils';
import Image from './Image';
import Sound from './Sound';
import TiledTileset from '../tiled/TiledTileset';
import TiledMap from '../tiled/TiledMap';

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

	private _scale: number;
	private loadingAssetData: { [id: string]: ResourceType };
	private responses: { [id: string]: any };
	private callback: any;
	audio: AudioSystem;
	private _assetRoot: string | undefined;
	private nextCallback: Function;

	/**
	 * Provides methods to load images, sounds, and Tiled maps.
	 *
	 * @param {number} scale How much to scale image resources.
	 * @param {AudioSystem} audio A web audio context.
	 * @param {string} [assetRoot] If specified, this is the implicit root
	 *        directory for all assets to load.  Use this if all assets are
	 *        in a subfolder or different hierarchy than the project itself.
	 * @constructor
	 */
	constructor(scale: number = 1, audio: AudioSystem, assetRoot?: string) {
		this._scale = scale || 1;
		this.loadingAssetData = {};
		this.responses = {};
		this.callback = null;
		this.audio = audio;
		this._assetRoot = assetRoot;
	}

	/**
	 * Starts loading a JSON resource.
	 * @param {string} id The ID to use when retrieving this resource.
	 * @param {string} [url=id] The URL of the resource, defaulting to
	 *        {@code id} if not specified.
	 */
	addJson(id: string, url: string = id) {

		if (this._assetRoot) {
			url = this._assetRoot + url;
		}

		if (this._isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.JSON };
		console.log('Adding: ' + id + ' => ' + url +
			', remaining == ' + Utils.getObjectSize(this.loadingAssetData) +
			', callback == ' + (this.callback !== null));

		const xhr: XMLHttpRequest = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				const response: string = xhr.responseText;
				this._completed(id, response);
			}
		};

		xhr.open('GET', url, true);
		xhr.send(null);

	}

	/**
	 * Starts loading a canvas resource.
	 * @param {string} id The ID to use when retrieving this resource.
	 * @param {string} imageSrc The URL of the resource.
	 */
	addCanvas(id: string, imageSrc: string) {

		if (this._assetRoot) {
			imageSrc = this._assetRoot + imageSrc;
		}

		const self: AssetLoader = this;

		const  image: HTMLImageElement = document.createElement('img'); //new Image();
		if (this._isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.IMAGE };
		console.log('Adding: ' + id + ' => ' + imageSrc +
			', remaining == ' + Utils.getObjectSize(this.loadingAssetData) +
			', callback == ' + (this.callback !== null));
		image.addEventListener('load', () => {
			const canvas: HTMLCanvasElement = ImageUtils.resize(image, self._scale);
			self._completed(id, canvas);
		});

		image.src = imageSrc;

	}

	/**
	 * Starts loading an image resource.
	 * @param {string} id The ID to use when retrieving this resource.
	 * @param {string} imageSrc The URL of the resource.
	 * @param {boolean} firstPixelTranslucent If truthy, the pixel at (0, 0)
	 *        is made translucent, along with all other pixels of the same
	 *        color.  The default value is <code>false</code>.
	 */
	addImage(id: string, imageSrc: string,
			firstPixelTranslucent: boolean = false) {

		if (this._assetRoot) {
			imageSrc = this._assetRoot + imageSrc;
		}

		const self: AssetLoader = this;

		const image: HTMLImageElement = document.createElement('img'); //new Image();
		if (this._isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.IMAGE };
		console.log('Adding: ' + id + ' => ' + imageSrc +
			', remaining == ' + Utils.getObjectSize(this.loadingAssetData) +
			', callback == ' + (this.callback !== null));
		image.addEventListener('load', () => {
			const canvas: HTMLCanvasElement = ImageUtils.resize(image, self._scale);
			const gtpImage: Image = new Image(canvas);
			if (firstPixelTranslucent) {
				gtpImage.makeColorTranslucent(0, 0);
			}
			self._completed(id, gtpImage);
		});

		image.src = imageSrc;

	}

	/**
	 * Starts loading a sound resource.
	 * @param {string} id The ID to use when retrieving this resource.
	 * @param {string} soundSrc The URL of the resource.
	 * @param {number} [loopStart=0] Where to start, in seconds, if/when this
	 *        sound loops (which is typical when using a sound as music).
	 * @param {boolean} [loopByDefaultIfMusic=true] Whether this sound should
	 *        loop by default when it is played as music.
	 */
	addSound(id: string, soundSrc: string, loopStart: number = 0,
			loopByDefaultIfMusic: boolean = true) {

		if (this.audio.isInitialized()) {

			if (this._isAlreadyTracked(id)) {
				return;
			}
			this.loadingAssetData[id] = { type: AssetType.AUDIO };

			if (this._assetRoot) {
				soundSrc = this._assetRoot + soundSrc;
			}

			const xhr: XMLHttpRequest = new XMLHttpRequest();
			xhr.onload = () => {
				// TODO: Clean up this API
				this.audio.context.decodeAudioData(xhr.response, (buffer: AudioBuffer) => {
					const sound: Sound = new Sound(id, buffer, loopStart || 0);
					if (typeof loopByDefaultIfMusic !== 'undefined') {
						sound.setLoopsByDefaultIfMusic(loopByDefaultIfMusic);
					}
					this.audio.addSound(sound);
					this._completed(id, buffer);
				});
			};

			xhr.open('GET', soundSrc, true);
			xhr.responseType = 'arraybuffer';
			xhr.send(null);

		}

	}

	/**
	 * Starts loading a sprite sheet resource.
	 * @param {string} id The ID to use when retrieving this resource.
	 * @param {string} imageSrc The URL of the resource.
	 * @param {int} cellW The width of a cell.
	 * @param {int} cellH The height of a cell.
	 * @param {int} spacingX The horizontal spacing between cells.  Assumed to
	 *        be 0 if not defined.
	 * @param {int} spacingY The vertical spacing between cells.  Assumed to
	 *        be 0 if not defined.
	 * @param {boolean} firstPixelTranslucent If truthy, the pixel at (0, 0)
	 *        is made translucent, along with all other pixels of the same color.
	 */
	addSpriteSheet(id: string, imageSrc: string, cellW: number, cellH: number,
			spacingX: number = 0, spacingY: number = 0,
			firstPixelTranslucent: boolean = false) {

		const self: AssetLoader = this;
		spacingX = spacingX || 0;
		spacingY = spacingY || 0;
		cellW *= self._scale;
		cellH *= self._scale;
		spacingX *= self._scale;
		spacingY *= self._scale;

		if (this._assetRoot) {
			imageSrc = this._assetRoot + imageSrc;
		}

		const image: HTMLImageElement = document.createElement('img'); //new Image();
		if (this._isAlreadyTracked(id)) {
			return;
		}
		this.loadingAssetData[id] = { type: AssetType.IMAGE };
		console.log('Adding: ' + id + ' => ' + imageSrc +
			', remaining == ' + Utils.getObjectSize(this.loadingAssetData) +
			', callback == ' + (this.callback !== null));
		image.addEventListener('load', () => {
			const canvas: HTMLCanvasElement = ImageUtils.resize(image, self._scale);
			const gtpImage: Image = new Image(canvas);
			if (firstPixelTranslucent) {
				gtpImage.makeColorTranslucent(0, 0);
			}
			const ss: SpriteSheet = new SpriteSheet(gtpImage, cellW, cellH, spacingX, spacingY);
			self._completed(id, ss);
		});

		image.src = imageSrc;

	}

	/**
	 * Registers all images needed by the TMX map's tilesets to this asset
	 * loader.
	 *
	 * @param {TiledMap} map The Tiled map.
	 */
	addTmxMap(map: TiledMap) {
		if (map.tilesets && map.tilesets.length) {
			for (let i: number = 0; i < map.tilesets.length; i++) {
				const tileset: TiledTileset = map.tilesets[i];
				const id: string = '_tilesetImage_' + tileset.name;
				this.addImage(id, tileset.image);
			}
		}
	}

	/**
	 * Returns the image corresponding to a Tiled tileset.  This method is
	 * called by the library and is typically not called directly by the
	 * application.
	 *
	 * @param {TiledTileset} tileset The tile set.
	 * @return {Image} The tileset image.
	 */
	getTmxTilesetImage(tileset: TiledTileset): Image {
		return this.responses['_tilesetImage_' + tileset.name];
	}

	/**
	 * Retrieves a resource by ID.
	 * @param {string} res The ID of the resource.
	 * @return The resource, or null if not found.
	 */
	get(res: string): any {
		return this.responses[res];
	}

	_isAlreadyTracked(id: string): boolean {
		if (this.loadingAssetData[id]) {
			console.log('A resource with id ' + id + ' is already loading.  Assuming they are the same');
			return true;
		}
		else if (this.responses[id]) {
			console.log('A resource with id ' + id + ' has already been loaded.');
			return true;
		}
		return false;
	}

	/**
	 * Adds a resource.
	 * @param {string} res The ID for the resource.
	 * @param {any} value The resource value.
	 */
	set(res: string, value: any) {
		this.responses[res] = value;
	}

	_completed(res: string, response: any) {
		if (!this.loadingAssetData[res]) {
			console.error('Resource not found! - ' + res);
			return;
		}
		if (this.loadingAssetData[res].type === AssetType.JSON) {
			response = JSON.parse(response);
		}
		this.responses[res] = response;
		delete this.loadingAssetData[res];
		console.log('Completed: ' + res + ', remaining == ' +
				Utils.getObjectSize(this.loadingAssetData) +
				', callback == ' + (this.callback !== null));
		if (this.isDoneLoading() && this.callback) {
			this.callback.call();
			delete this.callback;
			console.log('... Callback called and deleted (callback == ' + (this.callback !== null) + ')');
			if (this.nextCallback) {
				this.callback = this.nextCallback;
				delete this.nextCallback;
			}
		}
		else {
			console.log('... Not running callback - ' + this.isDoneLoading() + ', ' + (this.callback !== null));
		}
	}

	/**
	 * Returns whether all assets in this loader have successfully loaded.
	 *
	 * @return {boolean} Whether all assets have loaded.
	 */
	isDoneLoading(): boolean {
		return Utils.getObjectSize(this.loadingAssetData) === 0;
	}

	onLoad(callback: Function) {

		if (this.isDoneLoading()) {
			callback();
		}
		else if (this.callback) { // A new callback added from another callback
			this.nextCallback = callback;
		}
		else {
			this.callback = callback;
		}
	}

}
