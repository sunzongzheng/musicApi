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
      link: `https://y.qq.com/n/yqq/song/${info.mid}.html`,
      id: info.id,
      cp: info.action.msg === 3 || !info.interval,
      dl: !info.pay.pay_down,
      quality: {
        192: Boolean(file.size_aac || file.size_192aac || file.size_ogg || file.size_192ogg),
        320: Boolean(file.size_320 || file.size_320mp3),
        999: Boolean(info.file.size_flac)
      },
      mv: info.mv.vid || null,
      vendor: 'qq'
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
      link: `https://y.qq.com/n/yqq/song/${info.mid}.html`,
      id: info.songid,
      cp: info.msgid === 3 || !info.interval,
      dl: !info.pay.paydownload,
      quality: {
        192: Boolean(info.sizeogg),
        320: Boolean(info.size320),
        999: Boolean(info.sizeflac)
      },
      mv: info.vid || null,
      vendor: 'qq'
    };
  };

  return {
    instance,

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
          remoteplace: 'txt.yqq.song',
          aggr: 1,
          cr: 1,
          lossless: 0
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
          return e;
        }
      })();
    },

    getSongDetail(id, raw = false, type = 'songid') {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
            [type]: id,
            tpl: 'yqq_song_detail'
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
          return e;
        }
      })();
    },

    getBatchSongDetail(songids) {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
            songid: songids.join(','),
            tpl: 'yqq_song_detail'
          });
          return {
            status: true,
            data: data.data.map(item => getMusicInfo(item))
          };
        } catch (e) {
          return e;
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
        const mid = yield _this2.getMid(songid);
        const guid = `${Math.floor(Math.random() * 1000000000)}`;
        const uin = '0';
        let data;

        try {
          const _ref = yield instance.get('/cgi-bin/musicu.fcg', {
            data: JSON.stringify({
              "req": {
                "module": "CDN.SrfCdnDispatchServer",
                "method": "GetCdnDispatch",
                "param": {
                  guid,
                  "calltype": 0,
                  "userip": ""
                }
              },
              "req_0": {
                "module": "vkey.GetVkeyServer",
                "method": "CgiGetVkey",
                "param": {
                  guid,
                  "songmid": [mid],
                  "songtype": [0],
                  uin,
                  "loginflag": 1,
                  "platform": "20"
                }
              },
              "comm": {
                uin,
                "format": "json",
                "ct": 24,
                "cv": 0
              }
            })
          }, {
            newApi: true
          }),
                freeflowsip = _ref.req.data.freeflowsip,
                midurlinfo = _ref.req_0.data.midurlinfo;

          const host = freeflowsip[0];
          data = {
            status: true,
            data: {
              url: host + midurlinfo[0].purl
            }
          };
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
            'pcachetime': Date.parse(new Date()),
            'songmid': mid
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
          return e;
        }
      })();
    },

    getComment(songid, page = 1, pagesize = 20) {
      return _asyncToGenerator(function* () {
        try {
          const _ref2 = yield instance.get('/base/fcgi-bin/fcg_global_comment_h5.fcg', {
            reqtype: 2,
            biztype: 1,
            topid: songid,
            cmd: 8,
            needmusiccrit: 0,
            pagenum: page - 1,
            pagesize,
            lasthotcommentid: '',
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
          return e;
        }
      })();
    },

    getArtistSongs(id, offset, limit) {
      return _asyncToGenerator(function* () {
        try {
          const params = {
            platform: 'h5page',
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
          return e;
        }
      })();
    },

    getPlaylistDetail(id, offset, limit) {
      return _asyncToGenerator(function* () {
        try {
          const params = {
            type: 1,
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
          return e;
        }
      })();
    },

    getMusicu(data) {
      return instance.get('/cgi-bin/musicu.fcg', {
        data: JSON.stringify(data)
      }, {
        newApi: true
      });
    },

    getArtists(offset = 0, param) {
      var _this4 = this;

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
          const _ref6 = yield _this4.getMusicu({
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
          }),
                singerList = _ref6.singerList;

          return {
            status: true,
            data: singerList.data
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getAlbumDetail(id) {
      return _asyncToGenerator(function* () {
        try {
          const _ref7 = yield instance.get('https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg', {
            albumid: id,
            tpl: 'yqq_song_detail'
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
          return e;
        }
      })();
    },

    getAllTopList() {
      return _asyncToGenerator(function* () {
        const params = {
          page: 'index',
          format: 'html',
          tpl: 'macv4',
          v8debug: 1
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
                cover: item.pic_v12,
                list: item.songlist.map((item, i) => {
                  return {
                    artists: [{
                      id: item.singerid,
                      name: item.singername
                    }],
                    name: item.songname,
                    id: item.songid
                  };
                })
              };
            })
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getTopList(id) {
      return _asyncToGenerator(function* () {
        const params = {
          platform: 'h5',
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
              cover: data.topinfo.pic_v12,
              playCount: data.topinfo.listennum,
              list: data.songlist.map(item => getMusicInfo2(item.data))
            }
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getUserInfo() {
      return _asyncToGenerator(function* () {
        try {
          const _ref8 = yield instance.get('/portalcgi/fcgi-bin/music_mini_portal/fcg_getuser_infoEx.fcg'),
                data = _ref8.data;

          return {
            status: true,
            data
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getRecommendPlaylist() {
      var _this5 = this;

      return _asyncToGenerator(function* () {
        try {
          const _ref9 = yield _this5.getMusicu({
            'comm': {
              'ct': 24
            },
            'recomPlaylist': {
              'method': 'get_hot_recommend',
              'param': {
                'async': 1,
                'cmd': 2
              },
              'module': 'playlist.HotRecommendServer'
            }
          }),
                recomPlaylist = _ref9.recomPlaylist;

          return {
            status: true,
            data: recomPlaylist.data.v_hot
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getRecommendSongs(page = 1, limit = 30) {
      var _this6 = this;

      return _asyncToGenerator(function* () {
        try {
          const _ref10 = yield _this6.getMusicu({
            "comm": {
              "ct": 6,
              "cv": 50500
            },
            "get_daily_track": {
              "module": "music.ai_track_daily_svr",
              "method": "get_daily_track",
              "param": {
                "id": 99,
                "cmd": 0,
                "page": page - 1
              }
            }
          }),
                get_daily_track = _ref10.get_daily_track;

          return {
            status: true,
            data: get_daily_track.data.tracks.map(item => getMusicInfo(item))
          };
        } catch (e) {
          return e;
        }
      })();
    }

  };
}