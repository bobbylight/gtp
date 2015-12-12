declare module gtp {
    class BitmapFont extends SpriteSheet {
        constructor(gtpImage: Image, cellW: number, cellH: number, spacing: number, spacingY: number);
        drawString(str: string, x: number, y: number): void;
    }
}
