"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _netease = _interopRequireDefault(require("./netease"));

var _qq = _interopRequireDefault(require("./qq"));

var _base = _interopRequireDefault(require("./netease/instance/base"));

var _base2 = _interopRequireDefault(require("./qq/instance/base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(instance) {
  const provider = {
    netease: (0, _netease.default)((0, _base.default)(instance)),
    qq: (0, _qq.default)((0, _base2.default)(instance))
  };
  const vendors = ['netease', 'qq'];

  const paramsVerify = (vendor, id) => {
    // 参数校验
    if (!vendors.includes(vendor)) {
      return Promise.reject({
        status: false,
        msg: 'vendor错误'
      });
    }

    if (!id || Array.isArray(id) && !id.length) {
      return Promise.reject({
        status: false,
        msg: 'id不能为空'
      });
    }
  };

  const getData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (api, params, errorResponse) {
      let netease_rs = yield provider.netease[api](params);
      netease_rs = netease_rs.status ? netease_rs.data : errorResponse;
      let qq_rs = yield provider.qq[api](params);
      qq_rs = qq_rs.status ? qq_rs.data : errorResponse;
      return {
        status: true,
        data: {
          netease: netease_rs,
          qq: qq_rs
        }
      };
    });

    return function getData(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  return _objectSpread({}, provider, {
    // 搜索歌曲
    searchSong(keyword, offset = 0) {
      // 关键字不能为空
      if (!keyword) {
        return Promise.reject({
          status: false,
          msg: '查询参数不能为空'
        });
      }

      return getData('searchSong', {
        keyword,
        offset
      }, {
        total: 0,
        songs: []
      });
    },

    // 获取歌曲详情
    getSongDetail(vendor, id) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield provider[vendor]['getSongDetail'](id);
      })();
    },

    // 批量获取歌曲详情
    getBatchSongDetail(vendor, ids) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, ids);
        return yield provider[vendor]['getBatchSongDetail'](ids);
      })();
    },

    // 获取歌曲url
    getSongUrl(vendor, id, br = 128000) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield provider[vendor]['getSongUrl'](id, br);
      })();
    },

    // 获取歌词
    getLyric(vendor, id) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield provider[vendor]['getLyric'](id);
      })();
    },

    // 获取排行榜
    getTopList(id) {
      // id不能为空
      if (!id) {
        return {
          status: false,
          msg: 'id不能为空'
        };
      }

      return provider.netease.getTopList(id);
    },

    // 获取歌曲评论
    getComment(vendor, id, page = 1, limit = 20) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield provider[vendor]['getComment'](id, page, limit);
      })();
    },

    // 获取歌手单曲
    getArtistSongs(vendor, id, offset = 0, limit = 50) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield provider[vendor]['getArtistSongs'](id, offset, limit);
      })();
    },

    // 获取歌单歌曲
    getPlaylistDetail(vendor, id, offset = 0, limit = 65535) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield provider[vendor]['getPlaylistDetail'](id, offset, limit);
      })();
    },

    // 获取专辑详情
    getAlbumDetail(vendor, id) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield provider[vendor]['getAlbumDetail'](id);
      })();
    },

    // 批量获取任意vendor歌曲详情
    getAnyVendorSongDetail(arr, timeout = 0) {
      var _this = this;

      return _asyncToGenerator(function* () {
        // 先分类
        const songsList = {
          netease: [],
          qq: []
        };
        arr.forEach(item => {
          songsList[item.vendor].push(item.id);
        }); // 分类 批量获取详情 并存入歌曲对象

        const songsObject = {};

        for (var _i = 0, _Object$keys = Object.keys(songsList); _i < _Object$keys.length; _i++) {
          let vendor = _Object$keys[_i];
          const list = songsList[vendor];
          if (!list.length) continue;
          const limit = {
            qq: 50,
            netease: 1000
          }[vendor];
          let arr = [];

          for (let index = 0; index < list.length; index++) {
            arr.push(list[index]); // 达到限制 或 已是数组最后一个

            if (arr.length === limit || index + 1 === list.length) {
              // 获取详情
              const data = yield _this.getBatchSongDetail(vendor, arr);

              if (data.status) {
                data.data.forEach(song => {
                  songsObject[`${vendor}_${song.id}`] = song;
                });
              } else {
                console.warn(`${vendor}获取详情失败`);
              } // 重置待处理的数组


              arr = [];

              if (timeout) {
                yield new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                  }, timeout);
                });
              }
            }
          }
        } // 整理结果


        const rs = [];

        var _iterator = _createForOfIteratorHelper(arr),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            let _ref2 = _step.value;
            let id = _ref2.id,
                vendor = _ref2.vendor;
            const song = songsObject[`${vendor}_${id}`];

            if (song) {
              rs.push(song);
            } else {
              /*
              有可能是：歌曲id错误、更改了歌曲id、云平台删歌、批量获取详情失败 此处无法判断
              且有可能这种状态的歌曲数量较多 调单个获取接口有可能会导致被ban ip 此处直接返null
              */
              console.warn(`歌曲无法获取详情：${vendor} ${id}`);
              rs.push(null);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return rs;
      })();
    }

  });
}