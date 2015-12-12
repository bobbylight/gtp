declare module gtp {
    class SpriteSheet {
        gtpImage: gtp.Image;
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
         * @param {gtp.Image} gtpImage A GTP image that is the source for the sprite sheet.
         * @param {int} cellW The width of a cell in the sprite sheet.
         * @param {int} cellH The height of a cell in the sprite sheet.
         * @param {int} [spacing=1] Optional empty space between cells.
         * @param {int} [spacingY=spacing] Optional vertical empty space between cells.
         *        Specify only if different than the horizontal spacing.
         * @constructor
         */
        constructor(gtpImage: gtp.Image, cellW: number, cellH: number, spacing?: number, spacingY?: number);
        /**
         * Draws a sprite in this sprite sheet by row and column.
         * @param {CanvasRenderingContext2D} ctx The canvas' context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} row The row in the sprite sheet of the sprite to draw.
         * @param {int} col The column in the sprite sheet of the sprite to draw.
         */
        drawSprite(ctx: CanvasRenderingContext2D, x: number, y: number, row: number, col: number): void;
        /**
         * Draws a sprite in this sprite sheet by index
         * (<code>row*colCount + col</code>).
         * @param {CanvasRenderingContext2D} ctx The canvas' context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} index The index in the sprite sheet of the sprite to draw.
         */
        drawByIndex(ctx: CanvasRenderingContext2D, x: number, y: number, index: number): void;
    }
}
