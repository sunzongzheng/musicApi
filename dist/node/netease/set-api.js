"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var crypto_1 = __importDefault(require("./utils/crypto"));
var complete_cookie_1 = __importDefault(require("./utils/complete-cookie"));
var loginCacheKey = 'netease-login-cookie';
function setApi(Api) {
    Api.config.baseURL = 'http://music.163.com';
    Api.config.timeout = 5000;
    Api.config.rejectUnauthorized = false;
    Api.config.headers = {
        Accept: '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
        Connection: 'keep-alive',
        'X-Real-IP': '223.74.158.213',
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'http://music.163.com',
        Host: 'music.163.com',
        'User-Agent': utils_1.randomUserAgent(),
        Cookie: complete_cookie_1.default()
    };
    Api.interceptors.request.use(function (config) {
        var cryptoreq = crypto_1.default(config.body);
        // 浏览器且本地有cookie信息 接口就都带上cookie
        if (utils_1.isBrowser && utils_1.cache.get(loginCacheKey)) {
            config.headers.Cookie = loginCacheKey;
        }
        config.body = {
            params: cryptoreq.params,
            encSecKey: cryptoreq.encSecKey
        };
        return config;
    });
    Api.interceptors.response.use(function (res) {
        if (!res.data) {
            return Promise.reject({
                msg: '请求无结果',
                log: res
            });
        }
        var data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        if (data.code !== 200) {
            return Promise.reject({
                msg: '请求失败',
                log: res
            });
        }
        return data;
    }, function (e) { return Promise.reject(e); });
}
exports.default = setApi;
//# sourceMappingURL=set-api.js.map