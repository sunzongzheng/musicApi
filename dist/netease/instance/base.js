"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = require("../../util");

var _crypto = _interopRequireDefault(require("../crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(createInstance) {
  const fly = createInstance(); // fly.config.proxy = 'http://localhost:8888'

  fly.config.baseURL = 'http://music.163.com';
  fly.config.timeout = 5000;
  fly.config.headers = {
    Accept: '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
    Connection: 'keep-alive',
    'X-Real-IP': '223.74.158.213',
    // 此处加上可以解决海外请求的问题
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: 'http://music.163.com',
    Host: 'music.163.com',
    'User-Agent': (0, _util.randomUserAgent)()
  };
  fly.interceptors.request.use(config => {
    const cryptoreq = (0, _crypto.default)(config.body);
    config.body = {
      params: cryptoreq.params,
      encSecKey: cryptoreq.encSecKey
    };
    return config;
  }, e => Promise.reject(e));
  fly.interceptors.response.use(res => {
    if (!res.data) {
      return Promise.reject({
        status: false,
        msg: '请求无结果'
      });
    }

    const data = JSON.parse(res.data);

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