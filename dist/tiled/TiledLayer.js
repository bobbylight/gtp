var tiled;
(function (tiled) {
    'use strict';
    var TiledLayer = (function () {
        function TiledLayer(map, data) {
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
        }
        TiledLayer.prototype.getData = function (row, col) {
            if (!this.data) {
                return -1;
            }
            var index = this._getIndex(row, col);
            return this.data[index];
        };
        TiledLayer.prototype.setData = function (row, col, value) {
            if (!this.data) {
                return false;
            }
            var index = this._getIndex(row, col);
            this.data[index] = value;
        };
        TiledLayer.prototype._getIndex = function (row, col) {
            return row * this.map.colCount + col;
        };
        TiledLayer.prototype.getObjectByName = function (name) {
            return this.objectsByName ? this.objectsByName[name] : null;
        };
        TiledLayer.prototype.getObjectIntersecting = function (x, y, w, h) {
            if (this.objects) {
                for (var i = 0; i < this.objects.length; i++) {
                    var obj = this.objects[i];
                    if (obj.intersects(x, y, w, h)) {
                        return obj;
                    }
                }
            }
            return null;
        };
        TiledLayer.prototype.isObjectGroup = function () {
            return this.type === 'objectgroup';
        };
        TiledLayer.prototype._setObjects = function (objects) {
            'use strict';
            if (objects) {
                this.objects = [];
                this.objectsByName = {};
                for (var i = 0; i < objects.length; i++) {
                    var obj = new tiled.TiledObject(objects[i]);
                    this.objects.push(obj);
                    this.objectsByName[objects[i].name] = obj;
                }
            }
        };
        return TiledLayer;
    }());
    tiled.TiledLayer = TiledLayer;
})(tiled || (tiled = {}));

//# sourceMappingURL=TiledLayer.js.map
