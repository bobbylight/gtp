declare module tiled {
    class TiledLayer {
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
        objectsByName: {
            [name: string]: TiledObject;
        };
        constructor(map: any, data: any);
        getData(row: number, col: number): number;
        setData(row: number, col: number, value: number): boolean;
        private _getIndex(row, col);
        getObjectByName(name: string): TiledObject | null;
        getObjectIntersecting(x: number, y: number, w: number, h: number): TiledObject | null;
        isObjectGroup(): boolean;
        private _setObjects(objects);
    }
}
