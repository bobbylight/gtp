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
         * A list of all sound effects currently being played.  If a sound effect
         * is not looping (which is likely typical), it will be removed from this
         * list when it completes.  This data structure allows us to pause all sound
         * effects at the same time.
         */
        private _playingSounds;
        /**
         * Used to give all playing sound effects unique ids.
         */
        private _soundEffectIdGenerator;
        /**
         * A wrapper around web audio for games.
         *
         * @constructor
         */
        constructor();
        private _createPlayingSound(id, loop?, startOffset?, doneCallback?);
        private _createSoundEffectId();
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
         * @see playMusic
         * @see stopMusic
         */
        getCurrentMusic(): string;
        /**
         * Returns whether the audio system initialized properly.  This will return
         * false if the user's browser does not support the web audio API.
         * @return {boolean} Whether the sound system is initialized
         */
        isInitialized(): boolean;
        /**
         * Pauses all music and sound effects.
         * @see resumeAll
         */
        pauseAll(): void;
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
         * @param {boolean} loop Whether the music should loop.  Defaults to
         *        <code>false</code>.
         * @param {Function} doneCallback An optional callback to call when the
         *        sound completes. This callback will receive the returned numeric
         *        ID as a parameter.  This parameter is ignored if <code>loop</code>
         *        is <code>true</code>.
         * @return {number} An ID for the playing sound.  This can be used to
         *         stop a looping sound via <code>stopSound(id)</code>.
         * @see stopSound
         */
        playSound(id: string, loop?: boolean, doneCallback?: Function): number;
        /**
         * Removes a sound from our list of currently-being-played sound effects.
         * @param {number} id The sound effect to stop playing.
         * @return The sound just removed, or <code>null</code> if there was no such sound.
         */
        private _removePlayingSound(id);
        /**
         * Resumes all music and sound effects.
         * @see pauseAll
         */
        resumeAll(): void;
        /**
         * Stops the currently playing music, if any.
         * @param {boolean} pause If <code>true</code>, the music is only paused;
         *        otherwise, native resources are freed and the music cannot be
         *        resumed.
         * @see playMusic
         */
        stopMusic(pause?: boolean): void;
        /**
         * Stops a playing sound, by ID.
         * @param {number} id The sound effect to stop.
         * @return {boolean} Whether the sound effect was stopped.  This will be
         *         <code>false</code> if the sound effect specified is no longer
         *         playing.
         * @see playSound
         */
        stopSound(id: number): boolean;
        toggleMuted(): boolean;
        fadeMusic: boolean;
        musicFadeSeconds: number;
    }
}
