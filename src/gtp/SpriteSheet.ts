import Image, { ColorChange } from './Image';

/**
 * A collection of images contained in some sort of rectangular grid in a single image file.
 */
export default class SpriteSheet {

	gtpImage: Image;
	cellW: number;
	cellH: number;
	spacingX: number;
	spacingY: number;
	rowCount: number;
	colCount: number;
	size: number;

	/**
	 * Creates a sprite sheet.
	 *
	 * @param gtpImage A GTP image that is the source for the sprite sheet.
	 * @param cellW The width of a cell in the sprite sheet.
	 * @param cellH The height of a cell in the sprite sheet.
	 * @param [spacing=1] Optional empty space between cells.
	 * @param [spacingY=spacing] Optional vertical empty space between cells.
	 *        Specify only if different than the horizontal spacing.
	 * @param [scale=1] If gtpImage was scaled up, this is the scale factor.
	 *        The cell width, height, and spacing values will be multiplied
	 *        by this value.
	 */
	constructor(gtpImage: Image, cellW: number, cellH: number,
		spacing= 1, spacingY: number = spacing, scale= 1) {

		this.gtpImage = gtpImage;
		this.cellW = cellW;
		this.cellH = cellH;
		this.spacingX = spacing;
		this.spacingY = spacingY;

		if (scale !== 1) {
			this.cellW *= scale;
			this.cellH *= scale;
			this.spacingX *= scale;
			this.spacingY *= scale;
		}

		this.rowCount = Math.floor(gtpImage.height / (this.cellH + this.spacingY));
		if ((gtpImage.height - this.rowCount * (this.cellH + this.spacingY)) >= this.cellH) {
			this.rowCount++;
		}
		this.colCount = Math.floor(gtpImage.width / (this.cellW + this.spacingX));
		if ((gtpImage.width - this.colCount * (this.cellW + this.spacingX)) >= this.cellW) {
			this.colCount++;
		}

		this.size = this.rowCount * this.colCount;
	}

	/**
	 * Creates a copy of this sprite sheet with one or more colors changed.
	 *
	 * @param colorChanges The colors to change.
	 * @returns A new sprite sheet with the specified colors changed.
	 */
	createRecoloredCopy(...colorChanges: ColorChange[]): SpriteSheet {
		const newImage = this.gtpImage.createRecoloredCopy(...colorChanges);
		return new SpriteSheet(newImage, this.cellW, this.cellH, this.spacingX, this.spacingY);
	}

	/**
	 * Draws a sprite in this sprite sheet by row and column.
	 * @param ctx The canvas' context.
	 * @param x The x-coordinate at which to draw.
	 * @param y The y-coordinate at which to draw.
	 * @param row The row in the sprite sheet of the sprite to draw.
	 * @param col The column in the sprite sheet of the sprite to draw.
	 */
	drawSprite(ctx: CanvasRenderingContext2D, x: number, y: number, row: number, col: number) {
		const cellW: number = this.cellW;
		const cellH: number = this.cellH;
		const srcX: number = (cellW + this.spacingX) * col; //(col-1);
		const srcY: number = (cellH + this.spacingY) * row; //(row-1);
		this.gtpImage.drawScaled2(ctx, srcX, srcY, cellW, cellH, x, y, cellW, cellH);
	}

	/**
	 * Draws a sprite in this sprite sheet by index
	 * (<code>row*colCount + col</code>).
	 * @param ctx The canvas' context.
	 * @param x The x-coordinate at which to draw.
	 * @param y The y-coordinate at which to draw.
	 * @param index The index in the sprite sheet of the sprite to draw.
	 */
	drawByIndex(ctx: CanvasRenderingContext2D, x: number, y: number, index: number) {
		const row: number = Math.floor(index / this.colCount);
		const col: number = Math.floor(index % this.colCount);
		this.drawSprite(ctx, x, y, row, col);
	}

}
