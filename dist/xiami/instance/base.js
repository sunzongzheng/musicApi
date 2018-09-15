"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = require("../../util");

var _querystring = _interopRequireDefault(require("querystring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(createInstance) {
  const fly = createInstance(); // fly.config.proxy = 'http://localhost:8888'

  fly.config.baseURL = 'http://api.xiami.com';
  fly.config.timeout = 5000;
  fly.config.headers = {
    Cookie: 'user_from=2;XMPLAYER_addSongsToggler=0;XMPLAYER_isOpen=0;_xiamitoken=cb8bfadfe130abdbf5e2282c30f0b39a;',
    Referer: 'http://h.xiami.com/',
    'User-Agent': (0, _util.randomUserAgent)()
  };
  fly.interceptors.request.use(config => {
    if (config.pureFly) return config;

    const query = _querystring.default.stringify(config.body);

    config.body = query;
    config.url += query;
    return config;
  }, e => Promise.reject(e));
  fly.interceptors.response.use(res => {
    if (res.request.pureFly) return res;

    if (!res.data) {
      return Promise.reject({
        status: false,
        msg: '请求无结果'
      });
    }

    if (res.data.state !== 0 && !res.data.status) {
      return Promise.reject({
        status: false,
        msg: '请求失败',
        log: res.data
      });
    }

    return res.data.data;
  }, e => Promise.reject(e));
  return fly;
}