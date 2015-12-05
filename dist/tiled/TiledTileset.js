var tiled;
(function (tiled) {
    'use strict';
    var TiledTileset = (function () {
        function TiledTileset(data, imagePathModifier) {
            this.firstgid = data.firstgid;
            this.image = data.image;
            if (imagePathModifier) {
                this.image = imagePathModifier(this.image);
            }
            this.imageWidth = data.imagewidth;
            this.imageHeight = data.imageheight;
            this.margin = data.margin;
            this.name = data.name;
            this.properties = data.properties; // TODO
            this.spacing = data.spacing;
            this.tileWidth = data.tilewidth;
            this.tileHeight = data.tileheight;
        }
        TiledTileset.prototype.setScale = function (scale) {
            this.imageWidth *= scale;
            this.imageHeight *= scale;
            this.tileWidth *= scale;
            this.tileHeight *= scale;
            this.margin *= scale;
            this.spacing *= scale;
        };
        return TiledTileset;
    })();
    tiled.TiledTileset = TiledTileset;
})(tiled || (tiled = {}));

//# sourceMappingURL=TiledTileset.js.map
