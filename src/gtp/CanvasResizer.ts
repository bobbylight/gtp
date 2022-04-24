import { StretchMode } from './StretchMode';

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
export default {

	/**
	 * Resizes a canvas to use the specified stretch mode.
	 *
	 * @param canvas The canvas to resize.
	 * @param stretchMode The stretch mode to apply.
	 */
	resize(canvas: HTMLCanvasElement, stretchMode: StretchMode) {

		/* eslint-disable no-case-declarations */
		switch (stretchMode) {

			default:
			case StretchMode.STRETCH_NONE:
				canvas.style.width = canvas.width + 'px';
				canvas.style.height = canvas.height + 'px';
				break;

			case StretchMode.STRETCH_FILL:
				canvas.style.width = document.body.clientWidth + 'px';
				canvas.style.height = document.body.clientHeight + 'px';
				break;

			case StretchMode.STRETCH_PROPORTIONAL:
				const xFactor: number = document.body.clientWidth / canvas.width;
				const yFactor: number = document.body.clientHeight / canvas.height;
				const factor: number = Math.min(xFactor, yFactor);
				canvas.style.width = Math.floor(canvas.width * factor) + 'px';
				canvas.style.height = Math.floor(canvas.height * factor) + 'px';
				// Centering should be handled via CSS
				break;

		}
		/* eslint-enable no-case-declarations */
	},
};
