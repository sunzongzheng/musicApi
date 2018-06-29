"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = require("../util");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _default(instance) {
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
              songs: data.data.song.list.map(item => {
                return {
                  album: {
                    id: item.album.id,
                    name: item.album.name,
                    cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.album.mid}.jpg`
                  },
                  artists: item.singer.map(singer => {
                    return {
                      id: singer.mid,
                      name: singer.name
                    };
                  }),
                  name: item.name,
                  id: item.mid,
                  commentId: item.id,
                  cp: !item.action.alert
                };
              })
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

    getSongDetail(songmid) {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
            songmid,
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
          return {
            status: true,
            data: {
              album: {
                id: info.album.id,
                name: info.album.name,
                cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`
              },
              artists: info.singer.map(singer => {
                return {
                  id: singer.mid,
                  name: singer.name
                };
              }),
              name: info.name,
              id: info.mid,
              commentId: info.id,
              cp: !info.action.alert
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
    },

    getBatchSongDetail(songmids) {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
            songmid: songmids.join(','),
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
            data: data.data.map(info => {
              return {
                album: {
                  id: info.album.id,
                  name: info.album.name,
                  cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`
                },
                artists: info.singer.map(singer => {
                  return {
                    id: singer.mid,
                    name: singer.name
                  };
                }),
                name: info.name,
                id: info.mid,
                commentId: info.id,
                cp: !info.action.alert
              };
            })
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

    getSongUrl(id, level = 'normal') {
      return _asyncToGenerator(function* () {
        const guid = Math.floor(Math.random() * 1000000000);
        let data;

        try {
          const _ref = yield instance.get('/base/fcgi-bin/fcg_musicexpress.fcg', {
            json: 3,
            guid: guid
          }),
                key = _ref.key;

          switch (level) {
            case 'high':
              data = {
                status: true,
                data: {
                  url: `http://dl.stream.qqmusic.qq.com/M800${id}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                }
              };
              break;

            case 'normal':
              data = {
                status: true,
                data: {
                  url: `http://dl.stream.qqmusic.qq.com/M500${id}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                }
              };
              break;

            case 'low':
              data = {
                status: true,
                data: {
                  url: `http://ws.stream.qqmusic.qq.com/C100${id}.m4a?fromtag=38`
                }
              };
              break;
          }
        } catch (e) {
          data = {
            status: false,
            msg: '请求失败',
            log: e
          };
        }

        return data;
      })();
    },

    getLyric(id) {
      return _asyncToGenerator(function* () {
        try {
          let data = yield instance.get('/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
            'callback': 'callback',
            'pcachetime': Date.parse(new Date()),
            'songmid': id,
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
            msg: '请求失败',
            log: e
          };
        }
      })();
    },

    getComment(topid, pagenum = 0, pagesize = 20) {
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
            topid,
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
              hotComments: hot_comment ? hot_comment.commentlist : [],
              comments: comment.commentlist,
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
        const params = {
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
          singermid: id,
          order: 'listen',
          begin: offset * limit,
          num: limit,
          songstatus: 1
        };
        const data = yield instance.get('/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', params);
        return {
          status: true,
          data: {
            detail: {
              id,
              name: data.data.singer_name,
              avatar: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg`
            },
            songs: data.data.list.map(item => {
              const info = item.musicData;
              return {
                album: {
                  id: info.albumid,
                  name: info.albumname,
                  cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albummid}.jpg`
                },
                artists: info.singer.map(singer => {
                  return {
                    id: singer.mid,
                    name: singer.name
                  };
                }),
                name: info.songname,
                id: info.songmid,
                commentId: info.songmid,
                cp: !info.alertid
              };
            })
          }
        };
      })();
    }

  };
}