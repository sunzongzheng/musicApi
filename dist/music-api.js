"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _default(netease, qq, xiami) {
  const api = {
    netease,
    qq,
    xiami
  };
  const vendors = ['netease', 'qq', 'xiami'];

  const paramsVerify = (vendor, id) => {
    // 参数校验
    if (!vendors.includes(vendor)) {
      return Promise.reject({
        status: false,
        msg: 'vendor错误'
      });
    }

    if (!id) {
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
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield api[vendor]['getSongDetail'](id);
      })();
    },

    // 获取歌曲url
    getSongUrl(vendor, id) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield api[vendor]['getSongUrl'](id);
      })();
    },

    // 获取歌词
    getLyric(vendor, id) {
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield api[vendor]['getLyric'](id);
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
      return _asyncToGenerator(function* () {
        yield paramsVerify(vendor, id);
        return yield api[vendor]['getComment'](id, offset, limit);
      })();
    }

  };
}