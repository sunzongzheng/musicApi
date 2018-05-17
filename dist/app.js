"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.xiami = exports.qq = exports.netease = void 0;

var _musicApi = _interopRequireDefault(require("./music-api"));

var _netease = _interopRequireDefault(require("./netease"));

var _qq = _interopRequireDefault(require("./qq"));

var _xiami = _interopRequireDefault(require("./xiami"));

var _node = _interopRequireDefault(require("./netease/instance/node"));

var _node2 = _interopRequireDefault(require("./qq/instance/node"));

var _node3 = _interopRequireDefault(require("./xiami/instance/node"));

var _node4 = _interopRequireDefault(require("./xiami/instance/node.new"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const netease = (0, _netease.default)(_node.default);
exports.netease = netease;
const qq = (0, _qq.default)(_node2.default);
exports.qq = qq;
const xiami = (0, _xiami.default)(_node3.default, _node4.default);
exports.xiami = xiami;
const app = (0, _musicApi.default)(netease, qq, xiami);
app.netease = netease;
app.qq = qq;
app.xiami = xiami;
var _default = app;
exports.default = _default;