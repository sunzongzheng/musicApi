"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _netease = _interopRequireDefault(require("./netease"));

var _qq = _interopRequireDefault(require("./qq"));

var _xiami = _interopRequireDefault(require("./xiami"));

var _base = _interopRequireDefault(require("./netease/instance/base"));

var _base2 = _interopRequireDefault(require("./qq/instance/base"));

var _base3 = _interopRequireDefault(require("./xiami/instance/base"));

var _base4 = _interopRequireDefault(require("./xiami/instance/base.new"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _default(instance) {
  const netease = (0, _netease.default)((0, _base.default)(instance));
  const qq = (0, _qq.default)((0, _base2.default)(instance));
  const xiami = (0, _xiami.default)((0, _base3.default)(instance), (0, _base4.default)(instance));
  const vendors = ['netease', 'qq', 'xiami'];

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

  const getData =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (api, params) {
      let netease_rs = yield netease[api](params);
      netease_rs = netease_rs.status ? netease_rs.data : [];
      let qq_rs = yield qq[api](params);
      qq_rs = qq_rs.status ? qq_rs.data : [];
      let xiami_rs = yield xiami[api](params);
      xiami_rs = xiami_rs.status ? xiami_rs.data : [];
      return {
        status: true,
        data: {
          netease: netease_rs,
          qq: qq_rs,
          xiami: xiami_rs
        }
      };
    });

    return function getData(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  return {
    netease,
    qq,
    xiami,

    // 搜索歌曲
    searchSong(keyword, offset = 0) {
      // 关键字不能为空
      if (!keyword) {
        return {
          status: false,
          msg: '查询参数不能为空'
        };
      }

      return getData('searchSong', {
        keyword,
        offset
      });
    },

    // 获取歌曲详情
    getSongDetail(vendor, id) {
      var _this = this;

      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield _this[vendor]['getSongDetail'](id);
      })();
    },

    // 批量获取歌曲详情
    getBatchSongDetail(vendor, ids) {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, ids);
        return yield _this2[vendor]['getBatchSongDetail'](ids);
      })();
    },

    // 获取歌曲url
    getSongUrl(vendor, id) {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield _this3[vendor]['getSongUrl'](id);
      })();
    },

    // 获取歌词
    getLyric(vendor, id) {
      var _this4 = this;

      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield _this4[vendor]['getLyric'](id);
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

      return netease.getTopList(id);
    },

    // 获取歌曲评论
    getComment(vendor, id, offset = 0, limit = 20) {
      var _this5 = this;

      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield _this5[vendor]['getComment'](id, offset, limit);
      })();
    },

    // 获取歌手单曲
    getArtistSongs(vendor, id, offset = 0, limit = 50) {
      var _this6 = this;

      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield _this6[vendor]['getArtistSongs'](id, offset, limit);
      })();
    }

  };
}