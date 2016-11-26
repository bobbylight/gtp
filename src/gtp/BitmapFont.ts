import {Image} from './Image';
import {SpriteSheet} from './SpriteSheet';
import {Window} from './GtpBase';

export class BitmapFont extends SpriteSheet {

	constructor(gtpImage: Image, cellW: number, cellH: number, spacing: number, spacingY: number) {
		super(gtpImage, cellW, cellH, spacing, spacingY);
	}

	drawString(str: string, x: number, y: number) {

		const glyphCount: number = this.size;
		const gameWindow: Window = <any>window;
		const ctx: CanvasRenderingContext2D = gameWindow.game.canvas.getContext('2d')!;
		const charWidth: number = this.cellW;

		for (let i: number = 0; i < str.length; i++) {
			let ch: number = str.charCodeAt(i) - 0x20;
			if (ch < 0 || ch >= glyphCount) {
				ch = 0;
			}
			this.drawByIndex(ctx, x, y, ch);
			x += charWidth;
		}

	}
}
