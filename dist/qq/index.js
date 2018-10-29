"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = require("../util");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(instance) {
  const getMusicInfo = info => {
    const file = info.file;
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
      name: info.title,
      id: info.id,
      cp: info.action.msg === 3 || !info.interval,
      dl: !info.pay.pay_down,
      quality: {
        // 192: Boolean(file.size_aac || file.size_192aac || file.size_ogg || file.size_192ogg),
        192: false,
        320: Boolean(file.size_320 || file.size_320mp3),
        999: Boolean(info.file.size_flac)
      },
      mv: info.mv.vid
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
      cp: info.msgid === 3 || !info.interval,
      dl: !info.pay.paydownload,
      quality: {
        // 192: Boolean(info.sizeogg),
        192: false,
        320: Boolean(info.size320),
        999: Boolean(info.sizeflac)
      },
      mv: info.vid
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

    getSongUrl(songid, br = 128000) {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        br = parseInt(br);
        const guid = Math.floor(Math.random() * 1000000000);
        let data;

        try {
          const _ref = yield instance.get('/base/fcgi-bin/fcg_musicexpress.fcg', {
            json: 3,
            guid: guid
          }),
                key = _ref.key;

          const mid = yield _this2.getMid(songid);

          switch (br) {
            case 128000:
              data = {
                status: true,
                data: {
                  url: `http://dl.stream.qqmusic.qq.com/M500${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                }
              };
              break;

            case 320000:
              data = {
                status: true,
                data: {
                  url: `http://dl.stream.qqmusic.qq.com/M800${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                }
              };
              break;

            case 999000:
              data = {
                status: true,
                data: {
                  url: `http://dl.stream.qqmusic.qq.com/F000${mid}.flac?vkey=${key}&guid=${guid}&fromtag=54`
                }
              };
              break;

            default:
              throw new Error('br有误');
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
              data: {
                lyric: (0, _util.lyric_decode)(new Buffer(data.lyric, 'base64').toString()),
                translate: (0, _util.lyric_decode)(new Buffer(data.trans, 'base64').toString())
              }
            };
          } else {
            return {
              status: true,
              data: {
                lyric: [],
                translate: []
              }
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

    getComment(songid, page = 1, pagesize = 20) {
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
            pagenum: page - 1,
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
    },

    getAllTopList() {
      return _asyncToGenerator(function* () {
        const params = {
          page: 'index',
          format: 'html',
          tpl: 'macv4',
          v8debug: 1,
          jsonCallback: 'jsonCallback'
        };

        try {
          let data = yield instance.get('/v8/fcg-bin/fcg_v8_toplist_opt.fcg', params, {
            nocode: true
          });
          return {
            status: true,
            data: data.reduce((a, b) => a.List.concat(b.List)).map(item => {
              return {
                id: item.topID,
                name: item.ListName,
                cover: item.MacListPicUrl,
                list: item.songlist.map((item, i) => {
                  return {
                    artists: {
                      id: item.singerid,
                      name: item.singername
                    },
                    name: item.songname,
                    id: item.songid
                  };
                })
              };
            })
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

    getTopList(id) {
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
          platform: 'h5',
          needNewCode: 0,
          topid: id,
          tpl: 3,
          page: 'detail',
          type: 'top'
        };

        try {
          let data = yield instance.get('/v8/fcg-bin/fcg_v8_toplist_cp.fcg', params);
          return {
            status: true,
            data: {
              name: data.topinfo.ListName,
              description: data.topinfo.info,
              cover: data.topinfo.MacDetailPicUrl,
              playCount: data.topinfo.listennum,
              list: data.songlist.map(item => getMusicInfo2(item.data))
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
    }

  };
}