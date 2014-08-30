var tiled = tiled || {};

tiled.TiledTileset = function(data, imagePathModifier) {
   'use strict';
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
};

tiled.TiledTileset.prototype = {
   
   setScale: function(scale) {
      'use strict';
      this.imageWidth *= scale;
      this.imageHeight *= scale;
      this.tileWidth *= scale;
      this.tileHeight *= scale;
      this.margin *= scale;
      this.spacing *= scale;
   }
   
};
