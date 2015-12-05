var gtp;
(function (gtp) {
    'use strict';
    var Sound = (function () {
        function Sound(id, buffer, loopStart) {
            if (loopStart === void 0) { loopStart = 0; }
            this._id = id;
            this._buffer = buffer;
            this._loopsByDefault = true;
            this._loopStart = loopStart;
        }
        Sound.prototype.getBuffer = function () {
            return this._buffer;
        };
        Sound.prototype.getId = function () {
            return this._id;
        };
        Sound.prototype.getLoopsByDefaultIfMusic = function () {
            return this._loopsByDefault;
        };
        Sound.prototype.setLoopsByDefaultIfMusic = function (loopsByDefault) {
            this._loopsByDefault = loopsByDefault;
        };
        Sound.prototype.getLoopStart = function () {
            return this._loopStart;
        };
        Sound.prototype.setLoopStart = function (loopStart) {
            this._loopStart = loopStart;
        };
        return Sound;
    })();
    gtp.Sound = Sound;
})(gtp || (gtp = {}));

//# sourceMappingURL=Sound.js.map
