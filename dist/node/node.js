"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var custom_adapter_1 = __importDefault(require("./custom-adapter"));
var node_1 = __importDefault(require("flyio/src/adapter/node"));
var musicApi = custom_adapter_1.default(node_1.default);
exports.netease = musicApi.netease;
exports.qq = musicApi.qq;
exports.xiami = musicApi.xiami;
exports.default = musicApi;
//# sourceMappingURL=node.js.map