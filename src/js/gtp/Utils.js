var gtp = gtp || {};

gtp.Utils = function() {
};

/** 
 * Takes an img/canvas and a scaling factor and returns the scaled image.
 */
gtp.Utils.resize = function(img, scale) {
    
   // The original image is drawn into an offscreen canvas of the same size
   // and copied, pixel by pixel into another offscreen canvas with the 
   // new size.
   
   var orig, origCtx;
   if (img.nodeName.toLowerCase() === 'img') {
      orig = gtp.Utils.createCanvas(img.width, img.height);
      origCtx = orig.getContext('2d');
      origCtx.drawImage(img, 0, 0);
   }
   else { // Assume 'canvas'
      orig = img;
      origCtx = orig.getContext('2d');
   }
   
   if (scale === 1) {
      return orig; // No reason to scale
   }

   var origPixels = origCtx.getImageData(0, 0, img.width, img.height);
   
   var widthScaled = img.width * scale;
   var heightScaled = img.height * scale;
   var scaled = gtp.Utils.createCanvas(widthScaled, heightScaled);
   var scaledCtx = scaled.getContext('2d');
   var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);
   
   for( var y = 0; y < heightScaled; y++ ) {
      for( var x = 0; x < widthScaled; x++ ) {
         var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
         var indexScaled = (y * widthScaled + x) * 4;
         scaledPixels.data[ indexScaled ] = origPixels.data[ index ];
         scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
         scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
         scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
      }
   }
   
   scaledCtx.putImageData( scaledPixels, 0, 0 );
   return scaled;
};

gtp.Utils.getObjectSize = function(obj) {
   var size = 0;
   for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
         size++;
      }
   }
   return size;
};

gtp.Utils.mixin = function(source, target) {
   for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
         if (!target[prop]) {
            target[prop] = source[prop];
         }
      }
   }
};

gtp.Utils.createCanvas = function(width, height, parentDiv) {
   
   var canvas = document.createElement('canvas');
   canvas.width = width;
   canvas.height = height;
//this.canvas.style.width = (2 * width) + 'px';
   gtp.Utils.prepCanvas(canvas);
   
   if (parentDiv) {
      if (typeof parentDiv === 'string') {
         parentDiv = document.getElementById(parentDiv);
      }
      parentDiv.appendChild(canvas);
   }
   
   return canvas;
};

gtp.Utils.prepCanvas = function(canvas) {
   var ctx = canvas.getContext('2d');
   ctx.imageSmoothingEnabled = false;
   ctx.mozImageSmoothingEnabled = false;
   ctx.oImageSmoothingEnabled = false;
   ctx.webkitImageSmoothingEnabled = false;
   ctx.msImageSmoothingEnabled = false;
};

// Define console functions for IE9
if (!window.console) {
   var noOp = function() {};
   window.console = {
      log: noOp,
      warn: noOp,
      error: noOp
   };
}
