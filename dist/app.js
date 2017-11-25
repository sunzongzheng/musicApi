'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('./netease/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./qq/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./xiami/index');

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const api = {
    netease: _index2.default,
    qq: _index4.default,
    xiami: _index6.default
};
const app = {
    vendors: ['netease', 'qq', 'xiami'],
    // 搜索歌曲
    searchSong(keyword) {
        // 关键字不能为空
        if (!keyword || keyword.toString().trim().length < 1) {
            return {
                status: false,
                msg: '查询参数不能为空'
            };
        }
        return this.getData('searchSong', {
            keyword
        });
    },
    // 获取歌曲url
    getSongUrl(vendor, id) {
        // 参数校验
        if (!this.vendors.includes(vendor)) {
            return {
                status: false,
                msg: 'vendor错误'
            };
        }
        if (id.toString().trim().length < 1) {
            return {
                status: false,
                msg: 'id不能为空'
            };
        }
        return api[vendor]['getSongUrl'](id);
    },
    // 获取歌词
    getLyric(vendor, id) {
        // 参数校验
        if (!this.vendors.includes(vendor)) {
            return {
                status: false,
                msg: 'vendor错误'
            };
        }
        if (id.toString().trim().length < 1) {
            return {
                status: false,
                msg: 'id不能为空'
            };
        }
        return api[vendor]['getLyric'](id);
    },
    // 获取数据
    getData(api, params) {
        return _asyncToGenerator(function* () {
            let netease_rs = yield _index2.default[api](params);
            netease_rs = netease_rs.status ? netease_rs.data : [];
            let qq_rs = yield _index4.default[api](params);
            qq_rs = qq_rs.status ? qq_rs.data : [];
            let xiami_rs = yield _index6.default[api](params);
            xiami_rs = xiami_rs.status ? xiami_rs.data : [];
            return {
                status: true,
                data: {
                    netease: netease_rs,
                    qq: qq_rs,
                    xiami: xiami_rs
                }
            };
        })();
    }
};
exports.default = app;