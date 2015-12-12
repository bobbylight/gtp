declare module gtp {
    class ImageAtlas {
        private _atlasInfo;
        private _masterCanvas;
        constructor(args: any);
        parse(): {
            [id: string]: Image;
        };
    }
}
