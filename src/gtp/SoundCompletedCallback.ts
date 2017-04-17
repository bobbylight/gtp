/**
 * A callback that can be supplied to be called when a sound effect of music completes.
 */
export interface SoundCompletedCallback {
	(soundEffectInstanceId: number, soundEffectId: string): void;
}
