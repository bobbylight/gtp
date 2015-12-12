declare module tiled {
    class TiledTileset {
        firstgid: number;
        image: string;
        imageWidth: number;
        imageHeight: number;
        margin: number;
        name: string;
        properties: {};
        spacing: number;
        tileWidth: number;
        tileHeight: number;
        constructor(data: any, imagePathModifier?: Function);
        setScale(scale: number): void;
    }
}
