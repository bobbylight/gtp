/**
 * @namespace
 */
var gtp = gtp || {};

gtp.ImageAtlas = function(args) {
   'use strict';
   this._atlasInfo = args.atlasInfo;
   this._masterCanvas = args.canvas;
   if (this._atlasInfo.firstPixelIsTranslucent) {
      this._masterCanvas = gtp.ImageUtils.makeColorTranslucent(this._masterCanvas);
   }
};

gtp.ImageAtlas.prototype = {
   
   parse: function() {
      'use strict';
      
      var images = {};
      var self = this;
      
      this._atlasInfo.images.forEach(function(imgInfo) {
         
         var id = imgInfo.id;
         var dim;
         if (imgInfo.dim) {
            dim = imgInfo.dim.split(/,\s*/);
            if (dim.length !== 4) {
               throw new Error('Invalid value for imgInfo.dim: ' + imgInfo.dim);
            }
         }
         else {
            dim = [];
            dim.push(imgInfo.x, imgInfo.y, imgInfo.w, imgInfo.h);
         }
         
         dim = dim.map(function(str) {
            return parseInt(str, 10) * 2;
         });
         
         images[id] = new gtp.Image(self._masterCanvas, dim[0], dim[1], dim[2], dim[3]);
      });
      
      return images;
   }
   
};
