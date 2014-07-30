var tiled = tiled || {};

tiled.TiledLayer = function(map, data) {
	
	this.map = map;
	this.name = data.name;
	this.width = data.width;
	this.height = data.height;
	this.data = data.data;
	this.opacity = data.opacity;
	this.visible = data.visible;
	this.type = data.type;
	this.x = data.x;
	this.y = data.y;
	this._setObjects(data.objects);
};

tiled.TiledLayer.prototype = {
   
   getData: function(row, col) {
      if (!this.data) { // An object layer
         return -1;
      }
      var index = row * this.map.colCount + col;
      return this.data[index];
   },
   
   setData: function(row, col, value) {
      if (!this.data) { // An object layer
         return false;
      }
      var index = row * this.map.colCount + col; // TODO: Convert to a function
      this.data[index] = value;
   },
   
   getObjectByName: function(name) {
      return this.objectsByName ? this.objectsByName[name] : null;
   },
   
   getObjectIntersecting: function(x, y, w, h) {
      if (this.objects) {
         for (var i=0; i<this.objects.length; i++) {
            var obj = this.objects[i];
            if (obj.intersects(x, y, w, h)) {
               return obj;
            }
         }
      }
      return null;
   },
   
   isObjectGroup: function() {
      return this.type === 'objectgroup';
   },
   
   _setObjects: function(objects) {
      if (objects) {
         this.objects = [];
         this.objectsByName = {};
         for (var i=0; i<objects.length; i++) {
            var obj = new tiled.TiledObject(objects[i]);
            this.objects.push(obj);
            this.objectsByName[objects[i].name] = obj;
         }
      }
   }

};
