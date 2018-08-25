"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = require("../util");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _default(instance) {
  const getMusicInfo = info => {
    return {
      album: {
        id: info.album.id,
        name: info.album.name,
        cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`
      },
      artists: info.singer.map(singer => {
        return {
          id: singer.id,
          name: singer.name
        };
      }),
      name: info.name,
      id: info.id,
      cp: !info.action.alert
    };
  };

  const getMusicInfo2 = info => {
    return {
      album: {
        id: info.albumid,
        name: info.albumname,
        cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.albummid}.jpg`
      },
      artists: info.singer.map(singer => {
        return {
          id: singer.id,
          name: singer.name
        };
      }),
      name: info.songname,
      id: info.songid,
      cp: !info.alertid
    };
  };

  return {
    searchSong({
      keyword,
      limit = 30,
      offset = 0
    }) {
      return _asyncToGenerator(function* () {
        const params = {
          p: offset + 1,
          n: limit,
          w: keyword,
          ct: 24,
          new_json: 1,
          remoteplace: 'txt.yqq.song',
          aggr: 1,
          cr: 1,
          lossless: 0,
          format: 'jsonp',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          platform: 'yqq',
          needNewCode: 0
        };

        try {
          let data = yield instance.get('/soso/fcgi-bin/client_search_cp', params);
          return {
            status: true,
            data: {
              total: data.data.song.totalnum,
              songs: data.data.song.list.map(item => getMusicInfo(item))
            }
          };
        } catch (e) {
          return {
            status: false,
            msg: '获取失败',
            log: e
          };
        }
      })();
    },

    getSongDetail(id, raw = false, type = 'songid') {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
            [type]: id,
            tpl: 'yqq_song_detail',
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0
          });
          const info = data.data[0];

          if (!info) {
            return {
              status: false,
              msg: _util.noSongsDetailMsg
            };
          }

          return {
            status: true,
            data: raw ? info : getMusicInfo(info)
          };
        } catch (e) {
          return {
            status: false,
            msg: '请求失败',
            log: e
          };
        }
      })();
    },

    getBatchSongDetail(songids) {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
            songid: songids.join(','),
            tpl: 'yqq_song_detail',
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0
          });
          return {
            status: true,
            data: data.data.map(item => getMusicInfo(item))
          };
        } catch (e) {
          return {
            status: false,
            msg: '请求失败',
            log: e
          };
        }
      })();
    },

    getMid(id) {
      var _this = this;

      return _asyncToGenerator(function* () {
        const detailInfo = yield _this.getSongDetail(id, true);

        if (!detailInfo.status) {
          throw new Error(detailInfo.msg);
        }

        return detailInfo.data.mid;
      })();
    },

    getSongUrl(songid, level = 'normal') {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        const guid = Math.floor(Math.random() * 1000000000);
        let data;

        try {
          const _ref = yield instance.get('/base/fcgi-bin/fcg_musicexpress.fcg', {
            json: 3,
            guid: guid
          }),
                key = _ref.key;

          const mid = yield _this2.getMid(songid);

          switch (level) {
            case 'high':
              data = {
                status: true,
                data: {
                  url: `http://dl.stream.qqmusic.qq.com/M800${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                }
              };
              break;

            case 'normal':
              data = {
                status: true,
                data: {
                  url: `http://dl.stream.qqmusic.qq.com/M500${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                }
              };
              break;

            case 'low':
              data = {
                status: true,
                data: {
                  url: `http://ws.stream.qqmusic.qq.com/C100${mid}.m4a?fromtag=38`
                }
              };
              break;
          }
        } catch (e) {
          data = {
            status: false,
            msg: e.message || '请求失败',
            log: e
          };
        }

        return data;
      })();
    },

    getLyric(songid) {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        try {
          const mid = yield _this3.getMid(songid);
          let data = yield instance.get('/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
            'callback': 'callback',
            'pcachetime': Date.parse(new Date()),
            'songmid': mid,
            'g_tk': 5381,
            'jsonpCallback': 'callback',
            'loginUin': 0,
            'hostUin': 0,
            'format': 'jsonp',
            'inCharset': 'utf8',
            'outCharset': 'utf-8',
            'notice': 0,
            'platform': 'yqq',
            'needNewCode': 0
          });

          if (data.lyric) {
            return {
              status: true,
              data: (0, _util.lyric_decode)(new Buffer(data.lyric, 'base64').toString())
            };
          } else {
            return {
              status: true,
              data: []
            };
          }
        } catch (e) {
          return {
            status: false,
            msg: e.message || '请求失败',
            log: e
          };
        }
      })();
    },

    getComment(songid, pagenum = 0, pagesize = 20) {
      return _asyncToGenerator(function* () {
        try {
          const _ref2 = yield instance.get('/base/fcgi-bin/fcg_global_comment_h5.fcg', {
            jsonpCallback: 'callback',
            loginUin: 0,
            hostUin: 0,
            format: 'jsonp',
            inCharset: 'utf8',
            outCharset: 'utf8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            reqtype: 2,
            biztype: 1,
            topid: songid,
            cmd: 8,
            needmusiccrit: 0,
            pagenum,
            pagesize,
            lasthotcommentid: '',
            callback: 'callback',
            domain: 'qq.com'
          }),
                comment = _ref2.comment,
                hot_comment = _ref2.hot_comment;

          return {
            status: true,
            data: {
              hotComments: hot_comment && hot_comment.commentlist ? hot_comment.commentlist : [],
              comments: comment.commentlist || [],
              total: comment.commenttotal
            }
          };
        } catch (e) {
          console.warn(e);
          return {
            status: false,
            msg: '请求失败',
            log: e
          };
        }
      })();
    },

    getArtistSongs(id, offset, limit) {
      return _asyncToGenerator(function* () {
        try {
          const params = {
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5page',
            needNewCode: 0,
            from: 'h5',
            singerid: id,
            order: 'listen',
            begin: offset * limit,
            num: limit,
            songstatus: 1
          };

          const _ref3 = yield instance.get('/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', params),
                data = _ref3.data;

          return {
            status: true,
            data: {
              detail: {
                id,
                name: data.singer_name,
                avatar: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${data.singer_mid}.jpg`,
                desc: data.SingerDesc
              },
              songs: data.list.map(item => getMusicInfo2(item.musicData))
            }
          };
        } catch (e) {
          console.warn(e);
          return {
            status: false,
            msg: '请求失败',
            log: e
          };
        }
      })();
    },

    getAlbumSongs(id, offset, limit) {
      return _asyncToGenerator(function* () {
        try {
          const params = {
            type: 1,
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            onlysong: 0,
            disstid: id
          };

          const _ref4 = yield instance.get('/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg', params),
                cdlist = _ref4.cdlist;

          return {
            status: true,
            data: {
              detail: {
                id: cdlist[0].disstid,
                name: cdlist[0].dissname,
                cover: cdlist[0].logo,
                desc: cdlist[0].desc
              },
              songs: cdlist[0].songlist.map(info => getMusicInfo2(info))
            }
          };
        } catch (e) {
          console.warn(e);
          return {
            status: false,
            msg: '请求失败',
            log: e
          };
        }
      })();
    },

    getArtists(offset = 0, param) {
      return _asyncToGenerator(function* () {
        const _ref5 = param || {},
              _ref5$area = _ref5.area,
              area = _ref5$area === void 0 ? -100 : _ref5$area,
              _ref5$sex = _ref5.sex,
              sex = _ref5$sex === void 0 ? -100 : _ref5$sex,
              _ref5$genre = _ref5.genre,
              genre = _ref5$genre === void 0 ? -100 : _ref5$genre,
              _ref5$index = _ref5.index,
              index = _ref5$index === void 0 ? -100 : _ref5$index;

        try {
          const _ref6 = yield instance.get('/cgi-bin/musicu.fcg', {
            jsonpCallback: 'callback',
            callback: 'callback',
            loginUin: 0,
            hostUin: 0,
            format: 'jsonp',
            inCharset: 'utf8',
            outCharset: 'utf8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            data: JSON.stringify({
              comm: {
                ct: 24,
                cv: 10000
              },
              singerList: {
                module: 'Music.SingerListServer',
                method: 'get_singer_list',
                param: {
                  area,
                  sex,
                  genre,
                  index,
                  sin: offset * 80,
                  cur_page: offset + 1
                }
              }
            })
          }, {
            headers: {
              newApi: true
            }
          }),
                singerList = _ref6.singerList;

          return {
            status: true,
            data: singerList.data
          };
        } catch (e) {
          console.warn(e);
          return {
            status: false,
            msg: '请求失败',
            log: e
          };
        }
      })();
    },

    getAlbumDetail(id) {
      return _asyncToGenerator(function* () {
        try {
          const _ref7 = yield instance.get('https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg', {
            albumid: id,
            tpl: 'yqq_song_detail',
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0
          }),
                data = _ref7.data;

          return {
            status: true,
            data: {
              name: data.name,
              cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.mid}.jpg`,
              artist: {
                id: data.singerid,
                name: data.singername
              },
              desc: data.desc,
              publishTime: Date.parse(data.aDate),
              songs: data.list.map(item => getMusicInfo2(item))
            }
          };
        } catch (e) {
          return {
            status: false,
            msg: '请求失败',
            log: e
          };
        }
      })();
    }

  };
}