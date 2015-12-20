module tiled {
	'use strict';

	export class TiledLayer {

		map: any;
		name: string;
		width: number;
		height: number;
		data: number[];
		opacity: number;
		visible: boolean;
		type: string;
		x: number;
		y: number;
		objects: TiledObject[];
		objectsByName: { [name: string]: TiledObject };

		constructor(map: any, data: any) {
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

		getData(row: number, col: number): number {
			if (!this.data) { // An object layer
				return -1;
			}
			var index: number = this._getIndex(row, col);
			return this.data[index];
		}
   
		setData(row: number, col: number, value: number) {
			if (!this.data) { // An object layer
				return false;
			}
			var index: number = this._getIndex(row, col);
			this.data[index] = value;
		}
   
		private _getIndex(row: number, col: number): number {
			return row * this.map.colCount + col;
		}
   
		getObjectByName(name: string): TiledObject {
			return this.objectsByName ? this.objectsByName[name] : null;
		}
   
		getObjectIntersecting(x: number, y: number, w: number, h: number): TiledObject {
			if (this.objects) {
				for (var i: number = 0; i < this.objects.length; i++) {
					var obj: TiledObject = this.objects[i];
					if (obj.intersects(x, y, w, h)) {
						return obj;
					}
				}
			}
			return null;
		}
   
		isObjectGroup(): boolean {
			return this.type === 'objectgroup';
		}
   
		private _setObjects(objects: any) {
			'use strict';
			if (objects) {
				this.objects = [];
				this.objectsByName = {};
				for (var i: number = 0; i < objects.length; i++) {
					var obj: TiledObject = new tiled.TiledObject(objects[i]);
					this.objects.push(obj);
					this.objectsByName[objects[i].name] = obj;
				}
			}
		}

	}
}