"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../types/flyio.d.ts"/>
var utils_1 = require("../utils");
var md5_1 = __importDefault(require("md5"));
var url_1 = require("url");
var keys = {
    web: 'xiami-web-api-cookie',
    h5: 'xiami-h5-api-cookie'
};
function setMobileApi(Api) {
    // Api.config.proxy = 'http://localhost:8888'
    Api.config.timeout = 5000;
    Api.config.headers = {
        'User-Agent': utils_1.randomUserAgent(),
    };
    Api.config.rejectUnauthorized = false;
    Api.interceptors.request.use(function (request) {
        if (request.webApi) {
            var cookies_1 = utils_1.cache.get(keys.web);
            if (cookies_1) {
                request.headers.Cookie = Object.keys(cookies_1).map(function (key) { return key + "=" + cookies_1[key]; }).join('; ');
            }
            if (!request._retryed) {
                var params = request.body;
                request.body = {};
                request.body._q = JSON.stringify(params);
                request.url = "https://www.xiami.com/api" + request.url;
            }
            if (cookies_1 && cookies_1['xm_sg_tk']) {
                var url = new url_1.URL(request.url || '');
                request.body._s = md5_1.default(cookies_1['xm_sg_tk'].split("_")[0] + "_xmMain_" + url.pathname + "_" + request.body._q);
            }
        }
        else {
            request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            var cookies_2 = utils_1.cache.get(keys.h5);
            if (cookies_2) {
                request.headers.Cookie = Object.keys(cookies_2).map(function (key) { return key + "=" + cookies_2[key]; }).join('; ');
            }
            if (!request._retryed) {
                var params = request.body;
                var queryStr = JSON.stringify({
                    requestStr: JSON.stringify({
                        header: {
                            appId: 200,
                            appVersion: 1000000,
                            callId: new Date().getTime(),
                            network: 1,
                            platformId: 'mac',
                            remoteIp: '192.168.1.101',
                            resolution: '1178*778',
                        },
                        model: params
                    })
                });
                request.body = {
                    api: request.url,
                    v: '1.0',
                    type: 'originaljson',
                    dataType: 'json',
                    data: queryStr
                };
                request.url = "http://acs.m.xiami.com/h5/" + request.url + "/1.0/";
            }
            if (cookies_2 && cookies_2['_m_h5_tk']) {
                request.body.appKey = 12574478;
                request.body.t = +new Date();
                request.body.sign = md5_1.default(cookies_2['_m_h5_tk'].split('_')[0] + "&" + request.body.t + "&" + request.body.appKey + "&" + request.body.data);
            }
        }
        return request;
    });
    Api.interceptors.response.use(function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var responseCookie, cookies, cacheCookie_1, code, msg, split, retry_codes;
            return __generator(this, function (_a) {
                responseCookie = res.headers['set-cookie'];
                if (responseCookie) {
                    cookies = (Array.isArray(responseCookie) ? responseCookie : [responseCookie]);
                    cacheCookie_1 = {};
                    cookies.map(function (item) { return item.split(';')[0].trim(); }).map(function (item) { return item.split('='); }).forEach(function (item) {
                        cacheCookie_1[item[0]] = item[1];
                    });
                    utils_1.cache.set(res.request.webApi ? keys.web : keys.h5, cacheCookie_1);
                    console.log(cacheCookie_1);
                }
                if (res.request.webApi) {
                    code = res.data.code;
                    msg = res.data.msg;
                }
                else {
                    split = res.data.ret[0].split('::');
                    code = split[0];
                    msg = split[1];
                }
                retry_codes = res.request.webApi ?
                    ['SG_TOKEN_EMPTY', 'SG_TOKEN_EXPIRED', 'SG_EMPTY'] :
                    ['FAIL_SYS_TOKEN_EMPTY', 'FAIL_SYS_TOKEN_EXOIRED', 'FAIL_SYS_EMPTY'];
                if (code === 'SUCCESS') {
                    return [2 /*return*/, res.request.webApi ? res.data.result.data : res.data.data.data];
                }
                else if (retry_codes.includes(code)) { // token有问题 重试
                    if (res.request._retryed) { // 已重试过
                        if (res.request._retryed < 3) { // 次数未超过限制 重试
                            res.request._retryed++;
                            return [2 /*return*/, Api.request(res.request)];
                        }
                        else { // 超过限制 报错
                            return [2 /*return*/, Promise.reject({
                                    msg: msg,
                                    log: res
                                })];
                        }
                    }
                    else { // 未重试过
                        res.request._retryed = 1;
                        return [2 /*return*/, Api.request(res.request)];
                    }
                }
                else { // 抛错
                    return [2 /*return*/, Promise.reject({
                            msg: msg,
                            log: res
                        })];
                }
                return [2 /*return*/];
            });
        });
    }, function (e) {
        return Promise.reject({
            msg: '请求失败',
            log: e
        });
    });
}
exports.default = setMobileApi;
//# sourceMappingURL=set-api.js.map