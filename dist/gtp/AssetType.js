var gtp;
(function (gtp) {
    'use strict';
    (function (AssetType) {
        AssetType[AssetType["UNKNOWN"] = 0] = "UNKNOWN";
        AssetType[AssetType["IMAGE"] = 1] = "IMAGE";
        AssetType[AssetType["AUDIO"] = 2] = "AUDIO";
        AssetType[AssetType["JSON"] = 3] = "JSON";
    })(gtp.AssetType || (gtp.AssetType = {}));
    var AssetType = gtp.AssetType;
})(gtp || (gtp = {}));

//# sourceMappingURL=AssetType.js.map
