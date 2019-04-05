"use strict";
/// <reference path="./types/flyio.d.ts"/>
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var engine_wrapper_1 = __importDefault(require("flyio/dist/npm/engine-wrapper"));
var utils_1 = require("./utils");
var br;
(function (br) {
    br[br["normal"] = 128] = "normal";
    br[br["high"] = 320] = "high";
    br[br["max"] = 999] = "max";
})(br = exports.br || (exports.br = {}));
var vendor;
(function (vendor) {
    vendor["netease"] = "netease";
    vendor["qq"] = "qq";
    vendor["xiami"] = "xiami";
})(vendor = exports.vendor || (exports.vendor = {}));
var searchType;
(function (searchType) {
    searchType["song"] = "song";
    searchType["album"] = "album";
    searchType["singer"] = "singer";
    searchType["playlist"] = "playlist";
    searchType["user"] = "user";
})(searchType = exports.searchType || (exports.searchType = {}));
var MusicApi = /** @class */ (function () {
    function MusicApi(adapter) {
        this.engine = engine_wrapper_1.default(adapter);
    }
    MusicApi.prototype.checkId = function (id) {
        if (typeof id === 'undefined' || Array.isArray(id) && !id.length) {
            throw new utils_1.Err('id不能为空');
        }
    };
    MusicApi.prototype.checkBr = function (br) {
        if (![128, 320, 999].includes(br)) {
            throw new utils_1.Err({
                msg: 'br错误',
                log: br
            });
        }
    };
    return MusicApi;
}());
exports.default = MusicApi;
//# sourceMappingURL=music.api.class.js.map