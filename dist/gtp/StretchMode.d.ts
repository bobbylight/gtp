declare module gtp {
    /**
     * An enum of available stretch modes for games.  While typically used in desktop games, this can be used
     * in the browser as well, to allow the game to resize as the window is resized, according to their personal
     * preferences.<p>
     *
     * Note that for stretch modes to work, it is assumed that CSS is set up for the application similar to the
     * following, to allow stretching:
     *
     * <pre>
     * * {
     *    margin: 0;
     *    padding: 0;
     * }
     * html, body {
     *    width: 100%;
     *    height: 100%;
     * }
     * </pre>
     *
     * <ul>
     *    <li><code>STRETCH_NONE</code> renders the game in its "native" resolution.
     *    <li><code>STRETCH_FILL</code> makes the canvas fill the parent document.
     *    <li><code>STRETCH_PROPORTIONAL</code> stretches the canvas so it is as large as possible in the
     *       parent document, while maintaining its original aspect ratio.
     * </ul>
     */
    enum StretchMode {
        /**
         * No stretching is done.  If the area to paint in is smaller than
         * the game's native resolution, the area painted is clipped.  If the
         * area to paint is larger than the game's native resolution, then
         * the extra area is filled with some solid color (e.g. black or white).
         */
        STRETCH_NONE = 0,
        /**
         * The game's graphics are stretched to completely fill the window in
         * which they are being displayed.
         */
        STRETCH_FILL = 1,
        /**
         * The game's graphics are stretched so that they fill as much as possible
         * of the window in which they're being displayed, while maintaining their
         * proper aspect ratio.
         */
        STRETCH_PROPORTIONAL = 2,
    }
    /**
     * Utility methods to allow desktop games to resize to fit their parent document.  Typically, you will
     * register an <code>onresize</code> listener on the document body, and call <code>CanvasResizer.resize()</code>
     * with the appropriate stretch mode parameter.  This allows the user to specify whether they want the game
     * to stretch to fit, keep proportion, or display in its original resolution.<p>
     *
     * Note that for stretch modes to work, it is assumed that CSS is set up for the application similar to the
     * following, to allow stretching:
     *
     * <pre>
     * * {
     *    margin: 0;
     *    padding: 0;
     * }
     * html, body {
     *    width: 100%;
     *    height: 100%;
     * }
     * </pre>
     */
    class CanvasResizer {
        /**
         * Resizes a canvas to use the specified stretch mode.
         *
         * @param {HTMLCanvasElement} The canvas to resize.
         * @param {gtp.StretchMode} The stretch mode to apply.
         */
        static resize(canvas: HTMLCanvasElement, stretchMode: StretchMode): void;
    }
}
