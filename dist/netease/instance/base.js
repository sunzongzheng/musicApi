"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = require("../../util");

var _crypto = _interopRequireDefault(require("../crypto"));

var _querystring = _interopRequireDefault(require("querystring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(createInstance) {
  const fly = createInstance(); // fly.config.proxy = 'http://localhost:8888'

  fly.config.baseURL = 'https://music.163.com';
  fly.config.timeout = 5000;
  fly.config.headers = {
    Accept: '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
    Connection: 'keep-alive',
    // 'X-Real-IP': '223.74.158.213', // 此处加上可以解决海外请求的问题
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: 'http://music.163.com',
    Host: 'music.163.com',
    'User-Agent': (0, _util.randomUserAgent)(),
    Cookie: (0, _util.completeCookie)()
  };
  fly.config.rejectUnauthorized = false;
  fly.interceptors.request.use(config => {
    if (config.pureFly) return config; // 浏览器且本地有cookie信息 接口就都带上cookie

    if (typeof window !== 'undefined') {
      const loginCookies = localStorage.getItem('@suen/music-api-netease-login-cookie');

      if (loginCookies) {
        config.headers.Cookie = loginCookies;
      }
    }

    let data;

    if (config.crypto === 'linuxapi') {
      data = _crypto.default.linuxapi({
        method: config.method,
        url: config.baseURL + config.url.replace(/\w*api/, 'api'),
        params: config.body
      });
      config.headers['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36';
      config.url = '/api/linux/forward';
    } else {
      const cryptoreq = _crypto.default.weapi(config.body);

      data = {
        params: cryptoreq.params,
        encSecKey: cryptoreq.encSecKey
      };
    }

    config.body = _querystring.default.stringify(data);
    return config;
  }, e => Promise.reject(e));
  fly.interceptors.response.use(res => {
    if (res.request.pureFly) {
      return res;
    }

    if (!res.data) {
      return Promise.reject({
        status: false,
        msg: '请求无结果'
      });
    }

    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

    if (data.code !== 200) {
      return Promise.reject({
        status: false,
        msg: '请求失败',
        log: res.data
      });
    }

    return data;
  }, e => Promise.reject(e));
  return fly;
}