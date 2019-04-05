"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../types/flyio.d.ts"/>
var utils_1 = require("../utils");
function getACSRFToken(cookie) {
    function e(e) {
        for (var n = 5381, o = 0, t = e.length; t > o; ++o)
            n += (n << 5) + e.charCodeAt(o);
        return 2147483647 & n;
    }
    return e(cookie);
}
function setApi(Api) {
    Api.config.baseURL = 'https://c.y.qq.com';
    Api.config.timeout = 5000;
    Api.config.parseJson = false;
    Api.config.headers = {
        Referer: 'https://y.qq.com/portal/player.html',
        'User-Agent': utils_1.randomUserAgent()
    };
    Api.config.rejectUnauthorized = false;
    Api.interceptors.request.use(function (config) {
        if (config.newApi) {
            config.baseURL = 'https://u.y.qq.com';
            delete config.newApi;
        }
        // 浏览器且本地有cookie信息 接口就都带上cookie
        var loginUin = '0';
        var g_tk = 5381;
        if (utils_1.isBrowser) {
            var loginCookies = localStorage.getItem('@suen/music-api-qq-login-cookie');
            if (loginCookies) {
                try {
                    config.headers.Cookie = loginCookies;
                    var cookiesObject_1 = {};
                    loginCookies.replace(/\s*/g, '').split(';').map(function (item) { return item.split('='); }).forEach(function (item) {
                        cookiesObject_1[item[0]] = item[1];
                    });
                    loginUin = cookiesObject_1['uin'].substring(2);
                    g_tk = getACSRFToken(cookiesObject_1["p_skey"] || cookiesObject_1["skey"] || cookiesObject_1["p_lskey"] || cookiesObject_1["lskey"]);
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
        config.body = Object.assign({}, {
            g_tk: g_tk,
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin: loginUin,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            new_json: 1,
        }, config.body);
        return config;
    });
    Api.interceptors.response.use(function (res) {
        if (!res.data) {
            return Promise.reject({
                msg: '请求无结果',
                log: res
            });
        }
        // 是否有回调
        var hasCallback = false;
        var callbackArr = ['callback', 'jsonCallback', 'MusicJsonCallback'];
        callbackArr.forEach(function (item) {
            if (res.data.toString().trim().startsWith(item)) {
                var regex = new RegExp(item + '\\(([\\s\\S]*)\\)');
                var match = res.data.match(regex);
                res.data = JSON.parse(match[1]);
                hasCallback = true;
            }
        });
        if (!hasCallback) {
            return Promise.reject({
                msg: '请求结果错误',
                log: res.data
            });
        }
        // code是否正确
        if (!res.request.nocode && res.data.code !== 0) {
            return Promise.reject({
                msg: '请求结果报错',
                log: res.data
            });
        }
        return res.data;
    }, function (e) {
        console.warn(e);
        return Promise.reject({
            msg: '请求失败',
            log: e
        });
    });
}
exports.default = setApi;
//# sourceMappingURL=set-api.js.map