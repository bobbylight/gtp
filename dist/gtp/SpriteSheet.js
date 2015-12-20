var gtp;
(function (gtp) {
    'use strict';
    var SpriteSheet = (function () {
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
        function SpriteSheet(gtpImage, cellW, cellH, spacing, spacingY) {
            if (spacing === void 0) { spacing = 1; }
            if (spacingY === void 0) { spacingY = spacing; }
            this.gtpImage = gtpImage;
            this.cellW = cellW;
            this.cellH = cellH;
            this.spacingX = typeof spacing === 'undefined' ? 1 : spacing;
            this.spacingY = typeof spacingY === 'undefined' ? this.spacingX : spacingY;
            this.rowCount = Math.floor(gtpImage.height / (cellH + this.spacingY));
            if ((gtpImage.height - this.rowCount * (cellH + this.spacingY)) >= cellH) {
                this.rowCount++;
            }
            this.colCount = Math.floor(gtpImage.width / (cellW + this.spacingX));
            if ((gtpImage.width - this.colCount * (cellW + this.spacingX)) >= cellW) {
                this.colCount++;
            }
            this.size = this.rowCount * this.colCount;
        }
        /**
         * Draws a sprite in this sprite sheet by row and column.
         * @param {CanvasRenderingContext2D} ctx The canvas' context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} row The row in the sprite sheet of the sprite to draw.
         * @param {int} col The column in the sprite sheet of the sprite to draw.
         */
        SpriteSheet.prototype.drawSprite = function (ctx, x, y, row, col) {
            var cellW = this.cellW;
            var cellH = this.cellH;
            var srcX = (cellW + this.spacingX) * col; //(col-1);
            var srcY = (cellH + this.spacingY) * row; //(row-1);
            //ctx.drawImage(this.gtpImage.canvas, srcX,srcY,cellW,cellH, x,y,cellW,cellH);
            this.gtpImage.drawScaled2(ctx, srcX, srcY, cellW, cellH, x, y, cellW, cellH);
        };
        /**
         * Draws a sprite in this sprite sheet by index
         * (<code>row*colCount + col</code>).
         * @param {CanvasRenderingContext2D} ctx The canvas' context.
         * @param {int} x The x-coordinate at which to draw.
         * @param {int} y The y-coordinate at which to draw.
         * @param {int} index The index in the sprite sheet of the sprite to draw.
         */
        SpriteSheet.prototype.drawByIndex = function (ctx, x, y, index) {
            var row = Math.floor(index / this.colCount);
            var col = Math.floor(index % this.colCount);
            this.drawSprite(ctx, x, y, row, col);
        };
        return SpriteSheet;
    })();
    gtp.SpriteSheet = SpriteSheet;
})(gtp || (gtp = {}));

//# sourceMappingURL=SpriteSheet.js.map