module gtp {
	'use strict';

	export class BitmapFont extends SpriteSheet {

		constructor(gtpImage: Image, cellW: number, cellH: number, spacing: number, spacingY: number) {
			super(gtpImage, cellW, cellH, spacing, spacingY);
		}

		drawString(str: string, x: number, y: number) {

			var glyphCount: number = this.size;
			var ctx: CanvasRenderingContext2D = window.game.canvas.getContext('2d');
			var charWidth: number = this.cellW;

			for (var i: number = 0; i < str.length; i++) {
				var ch: number = str.charCodeAt(i) - 0x20;
				if (ch < 0 || ch >= glyphCount) {
					ch = 0;
				}
				this.drawByIndex(ctx, x, y, ch);
				x += charWidth;
			}

		}
	}
}