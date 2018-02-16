import Image from './Image';
import SpriteSheet from './SpriteSheet';
import { Window } from './GtpBase';

const FIRST_PRINTABLE_CODE_POINT: number = 0x20; // === ' '

/**
 * A font renderer that uses a bitmap for its glyphs.
 */
export default class BitmapFont extends SpriteSheet {

	constructor(gtpImage: Image, cellW: number, cellH: number, spacing: number, spacingY: number) {
		super(gtpImage, cellW, cellH, spacing, spacingY);
	}

	drawString(str: string, x: number, y: number) {

		const glyphCount: number = this.size;
		const gameWindow: Window = window as any;
		const ctx: CanvasRenderingContext2D = gameWindow.game.canvas.getContext('2d')!;
		const charWidth: number = this.cellW;

		for (let i: number = 0; i < str.length; i++) {
			let ch: number = str.charCodeAt(i) - FIRST_PRINTABLE_CODE_POINT;
			if (ch < 0 || ch >= glyphCount) {
				ch = 0;
			}
			this.drawByIndex(ctx, x, y, ch);
			x += charWidth;
		}

	}
}
