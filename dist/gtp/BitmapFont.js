/// <reference path="SpriteSheet.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gtp;
(function (gtp) {
    'use strict';
    var BitmapFont = (function (_super) {
        __extends(BitmapFont, _super);
        function BitmapFont(gtpImage, cellW, cellH, spacing, spacingY) {
            _super.call(this, gtpImage, cellW, cellH, spacing, spacingY);
        }
        BitmapFont.prototype.drawString = function (str, x, y) {
            var glyphCount = this.size;
            var ctx = window.game.canvas.getContext('2d');
            var charWidth = this.cellW;
            for (var i = 0; i < str.length; i++) {
                var ch = str.charCodeAt(i) - 0x20;
                if (ch < 0 || ch >= glyphCount) {
                    ch = 0;
                }
                this.drawByIndex(ctx, x, y, ch);
                x += charWidth;
            }
        };
        return BitmapFont;
    }(gtp.SpriteSheet));
    gtp.BitmapFont = BitmapFont;
})(gtp || (gtp = {}));

//# sourceMappingURL=BitmapFont.js.map
