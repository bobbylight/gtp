declare module gtp {
    class AudioSystem {
        private _currentMusic;
        private _sounds;
        private _musicFade;
        private _fadeMusic;
        private _muted;
        private _initialized;
        context: AudioContext;
        private _volumeFaderGain;
        private _musicFaderGain;
        private currentMusicId;
        private _musicLoopStart;
        /**
         * A wrapper around web audio for games.
         *
         * @constructor
         */
        constructor();
        /**
         * Initializes the audio system.
         */
        init(): void;
        /**
         * Registers a sound for later playback.
         * @param sound {gtp.Sound} The sound.
         */
        addSound(sound: gtp.Sound): void;
        fadeOutMusic(newMusicId: string): void;
        /**
         * Returns the ID of the current music being played.
         *
         * @return {string} The current music's ID.
         */
        getCurrentMusic(): string;
        /**
         * Returns whether the audio system initialized properly.  This will return
         * false if the user's browser does not support the web audio API.
         * @return {boolean} Whether the sound system is initialized
         */
        isInitialized(): boolean;
        /**
         * Plays a specific sound as background music.  Only one "music" can play
         * at a time, as opposed to "sounds," of which multiple can be playing at
         * one time.
         * @param {string} id The ID of the resource to play as music.  If this is
         *        <code>null</code>, the current music is stopped but no new music
         *        is started.
         * @param {boolean} loop Whether the music should loop.
         * @see stopMusic
         */
        playMusic(id: string, loop?: boolean): void;
        /**
         * Plays the sound with the given ID.
         * @param {string} id The ID of the resource to play.
         */
        playSound(id: string): void;
        /**
         * Stops the currently playing music, if any.
         * @param {boolean} pause If <code>true</code>, the music is only paused;
         *        otherwise, native resources are freed and the music cannot be
         *        resumed.
         * @see playMusic
         */
        stopMusic(pause?: boolean): void;
        toggleMuted(): boolean;
        fadeMusic: boolean;
        musicFadeSeconds: number;
    }
}
