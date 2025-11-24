import Image, { ColorChange } from './Image.js';
import SpriteSheet from './SpriteSheet.js';
import { Window } from './GtpBase.js';

/**
 * Specifies the default color for this font in calls to drawString() (that is, the
 * color of the original image).
 */
export const DEFAULT_COLOR = 'default';

const FIRST_PRINTABLE_CODE_POINT= 0x20; // === ' '

/**
 * A font renderer that uses a bitmap for its glyphs.
 */
export default class BitmapFont extends SpriteSheet {

	private fontMap: Record<string, SpriteSheet> = {};

	constructor(gtpImage: Image, cellW: number, cellH: number, spacing: number, spacingY: number, scale= 1) {
		super(gtpImage, cellW, cellH, spacing, spacingY, scale);
		this.fontMap[DEFAULT_COLOR] = this;
	}

	/**
	 * Adds a named color variant of this font. Games can use this method to load a font once,
	 * say with white text, then programmatically define red, green, etc. variants of it.
	 * The color specified can be passed to drawString() to render the font in that color.
	 *
	 * @param color The logical ID for the color.
	 * @param colorChanges The color changes to apply to the original image.
	 */
	addVariant(color: string, ...colorChanges: ColorChange[]) {
		this.fontMap[color] = this.createRecoloredCopy(...colorChanges);
	}

	drawString(str: string, x: number, y: number, color = DEFAULT_COLOR) {

		const glyphCount: number = this.size;
		const gameWindow: Window = window as any;
		const ctx: CanvasRenderingContext2D = gameWindow.game.getRenderingContext();
		const charWidth: number = this.cellW;
		const variant = this.fontMap[color] ?? this;

		for (let i= 0; i < str.length; i++) {
			let ch: number = str.charCodeAt(i) - FIRST_PRINTABLE_CODE_POINT;
			if (ch < 0 || ch >= glyphCount) {
				ch = 0;
			}
			variant.drawByIndex(ctx, x, y, ch);
			x += charWidth;
		}

	}
}
