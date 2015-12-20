declare module tiled {
    class TiledObject {
        gid: number;
        x: number;
        y: number;
        width: number;
        height: number;
        properties: {};
        constructor(data: any);
        intersects(ox: number, oy: number, ow: number, oh: number): boolean;
    }
}
