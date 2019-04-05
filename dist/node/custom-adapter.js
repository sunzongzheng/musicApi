"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var netease_1 = __importDefault(require("./netease"));
var qq_1 = __importDefault(require("./qq"));
var xiami_1 = __importDefault(require("./xiami"));
function getMusicApi(adapter) {
    var netease = new netease_1.default(adapter);
    var qq = new qq_1.default(adapter);
    var xiami = new xiami_1.default(adapter);
    return {
        netease: netease,
        qq: qq,
        xiami: xiami
    };
}
exports.default = getMusicApi;
//# sourceMappingURL=custom-adapter.js.map