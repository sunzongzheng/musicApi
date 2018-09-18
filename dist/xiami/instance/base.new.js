"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _cache = _interopRequireDefault(require("../cache"));

var _crypto = _interopRequireDefault(require("../crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

let haveEnableToken = false;

const getBody = (api, body) => {
  const queryStr = JSON.stringify({
    requestStr: JSON.stringify({
      header: {
        appId: 200,
        appVersion: 1000000,
        callId: new Date().getTime(),
        network: 1,
        platformId: 'mac',
        remoteIp: '192.168.1.101',
        resolution: '1178*778'
      },
      model: body
    })
  });
  const appKey = 12574478;
  const t = new Date().getTime();

  const sign = _crypto.default.MD5(`${_cache.default.cache.signedToken}&${t}&${appKey}&${queryStr}`);

  return {
    appKey,
    t,
    sign,
    api,
    v: '1.0',
    type: 'originaljson',
    dataType: 'json',
    // 会变化
    data: queryStr
  };
};

function _default(createInstance) {
  const fly = createInstance(); // fly.config.proxy = 'http://localhost:8888'

  fly.config.baseURL = 'http://acs.m.xiami.com/h5';
  fly.config.timeout = 5000;
  fly.config.headers = {
    Host: 'acs.m.xiami.com',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  fly.interceptors.request.use(request => {
    if (!haveEnableToken || _cache.default.cache.expire && +new Date() > _cache.default.cache.expire) {
      // 没有确认可用的token 先锁队列 只放行第一个
      fly.lock();
    }

    request.headers.cookie = (_cache.default.cache.token || []).join(';');
    request.bodycopy = request.body;
    request.body = getBody(request.url, request.body);
    request.urlcopy = request.url;
    request.url = `/${request.url}/1.0/`;
    return request;
  });
  fly.interceptors.response.use(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (res) {
      try {
        // 只要返了cookie 就更新token
        if (res.headers['set-cookie']) {
          const token = res.headers['set-cookie'].split('Path=/,').map(i => i.split(';')[0].trim());
          const myToken = token[0].replace('_m_h5_tk=', '').split('_')[0];

          _cache.default.setCache({
            token,
            signedToken: myToken
          });

          if (!haveEnableToken || _cache.default.cache.expire && +new Date() > _cache.default.cache.expire) {
            // 没有确认可用的token 解锁队列
            haveEnableToken = true;
            fly.unlock();
            return fly.get(res.request.urlcopy, res.request.bodycopy).then(data => data).catch(e => e);
          }
        }
      } catch (e) {
        console.warn('返回cookie格式变化，请检查', res);
      }

      const status = res.data.ret[0];

      if (status.startsWith('SUCCESS')) {
        return res.data.data.data;
      } else {
        return Promise.reject({
          status: false,
          msg: status.split('::')[1],
          log: res
        });
      }
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), e => {
    return Promise.reject({
      status: false,
      msg: '请求失败',
      log: e
    });
  });
  return fly;
}