"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _flyio = _interopRequireDefault(require("flyio"));

var _util = require("../util");

var _crypto = _interopRequireDefault(require("./crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

let cache = {
  token: null,
  signedToken: null,
  expire: null
};

function _default(instance, newApiInstance) {
  return {
    // 根据api获取虾米token
    getXiamiToken(api) {
      return _asyncToGenerator(function* () {
        if (cache.token && cache.signedToken && +new Date() <= cache.expire) {
          return cache;
        }

        try {
          yield newApiInstance.get(`/${api}/1.0/`);
        } catch (res) {
          if (res.status === 200) {
            let token = res.headers['set-cookie'].split('Path=/,');
            token = token.map(i => i.split(';')[0].trim());
            const myToken = token[0].replace('_m_h5_tk=', '').split('_')[0];
            cache = {
              token,
              signedToken: myToken,
              expire: +new Date() + 5 * 60 * 1000
            };
            return cache;
          } else {
            return Promise.reject({
              msg: '获取token失败'
            });
          }
        }
      })();
    },

    // 根据签名token获取数据
    getDataWithSign(api, model) {
      var _this = this;

      return _asyncToGenerator(function* () {
        const _ref = yield _this.getXiamiToken(api),
              token = _ref.token,
              signedToken = _ref.signedToken;

        const appKey = 12574478;
        const queryStr = JSON.stringify({
          requestStr: JSON.stringify({
            header: {
              appId: 200,
              appVersion: 1000000,
              callId: new Date().getTime(),
              network: 1,
              platformId: 'mac',
              remoteIp: '192.168.1.101',
              resolution: '1178*778'
            },
            model
          })
        });
        const t = new Date().getTime();

        const sign = _crypto.default.MD5(`${signedToken}&${t}&${appKey}&${queryStr}`);

        return yield newApiInstance.get(`/${api}/1.0/`, {
          appKey,
          // 会变化
          t,
          // 会变化
          sign,
          // 会变化
          api,
          v: '1.0',
          type: 'originaljson',
          dataType: 'json',
          // 会变化
          data: queryStr
        }, {
          headers: {
            'cookie': token.join(';') // 会变化

          }
        });
      })();
    },

    searchSong({
      keyword,
      limit = 30,
      offset = 0
    }) {
      return _asyncToGenerator(function* () {
        const params = {
          v: '2.0',
          key: keyword,
          limit: limit,
          page: offset + 1,
          r: 'search/songs',
          app_key: 1
        };

        try {
          let data = yield instance.post('/web?', params);
          return {
            status: true,
            data: {
              total: data.total,
              songs: data.songs.map(item => {
                return {
                  album: {
                    id: item.album_id,
                    name: item.album_name,
                    cover: item.album_logo.replace('http', 'https').replace('1.jpg', '2.jpg').replace('1.png', '4.png')
                  },
                  artists: [{
                    id: item.artist_id,
                    name: item.artist_name
                  }],
                  name: item.song_name,
                  id: item.song_id,
                  cp: !item.listen_file
                };
              })
            }
          };
        } catch (e) {
          return Promise.reject(e);
        }
      })();
    },

    getSongDetail(id, getRaw = false) {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        try {
          const data = yield _this2.getDataWithSign('mtop.alimusic.music.songservice.getsongs', {
            songIds: [id]
          });
          const info = data.songs[0];

          if (!info) {
            return {
              status: false,
              msg: _util.noSongsDetailMsg
            };
          }

          if (getRaw) {
            return {
              status: true,
              data: info
            };
          }

          return {
            status: true,
            data: {
              album: {
                id: info.albumId,
                name: info.albumName,
                cover: info.albumLogo.replace('http', 'https').replace('1.jpg', '2.jpg').replace('1.png', '4.png')
              },
              artists: [{
                id: info.artistId,
                name: info.artistName
              }],
              name: info.songName,
              id: info.songId,
              cp: !info.listenFiles.length
            }
          };
        } catch (e) {
          console.warn(e);

          if (e.status === 200) {
            return {
              status: false,
              msg: e.ret[0].slice('::')[1],
              log: e
            };
          } else {
            return {
              status: false,
              msg: '请求失败',
              log: e
            };
          }
        }
      })();
    },

    getBatchSongDetail(ids) {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        try {
          const data = yield _this3.getDataWithSign('mtop.alimusic.music.songservice.getsongs', {
            songIds: ids
          });
          return {
            status: true,
            data: data.songs.map(info => {
              return {
                album: {
                  id: info.albumId,
                  name: info.albumName,
                  cover: info.albumLogo.replace('http', 'https').replace('1.jpg', '2.jpg').replace('1.png', '4.png')
                },
                artists: [{
                  id: info.artistId,
                  name: info.artistName
                }],
                name: info.songName,
                id: info.songId,
                cp: !info.listenFiles.length
              };
            })
          };
        } catch (e) {
          console.warn(e);

          if (e.status === 200) {
            return {
              status: false,
              msg: e.ret[0].slice('::')[1],
              log: e
            };
          } else {
            return {
              status: false,
              msg: '请求失败',
              log: e
            };
          }
        }
      })();
    },

    getSongUrl(id) {
      var _this4 = this;

      return _asyncToGenerator(function* () {
        try {
          let data = yield instance.get(`http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`);
          return {
            status: true,
            data: {
              url: _this4.parseLocation(data.trackList[0].location)
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

    getLyric(id) {
      var _this5 = this;

      return _asyncToGenerator(function* () {
        let lyric_url;

        try {
          let data = yield _this5.getSongDetail(id, true);

          if (data.status) {
            lyric_url = data.data.lyricInfo.lyricFile;
          } else {
            return {
              status: false,
              data: [],
              log: data.log
            };
          }
        } catch (e) {
          return {
            status: true,
            data: [],
            log: e
          };
        }

        if (lyric_url) {
          try {
            let _ref2 = yield _flyio.default.get(lyric_url),
                data = _ref2.data;

            return {
              status: true,
              data: (0, _util.lyric_decode)(data)
            };
          } catch (e) {
            return {
              status: true,
              data: [],
              log: e
            };
          }
        } else {
          return {
            status: true,
            data: [],
            log: '未获取到歌曲url'
          };
        }
      })();
    },

    getComment(objectId, offset, pageSize) {
      var _this6 = this;

      return _asyncToGenerator(function* () {
        try {
          const data = yield _this6.getDataWithSign('mtop.alimusic.social.commentservice.getcommentlist', {
            objectId,
            // 会变化
            objectType: 'song',
            pagingVO: {
              page: offset + 1,
              pageSize
            }
          });
          return {
            status: true,
            data: {
              hotComments: [],
              comments: data.commentVOList || [],
              total: data.pagingVO.count
            }
          };
        } catch (e) {
          console.warn(e);

          if (e.status === 200) {
            return {
              status: false,
              msg: e.ret[0].slice('::')[1],
              log: e
            };
          } else {
            return {
              status: false,
              msg: '请求失败',
              log: e
            };
          }
        }
      })();
    },

    parseLocation(location) {
      let head = parseInt(location.substr(0, 1));

      let _str = location.substr(1);

      let rows = head;
      let cols = parseInt(_str.length / rows) + 1;
      let output = '';
      let full_row;

      for (let i = 0; i < head; i++) {
        if ((_str.length - i) / head === parseInt(_str.length / head)) {
          full_row = i;
        }
      }

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < head; r++) {
          if (c === cols - 1 && r >= full_row) {
            continue;
          }

          let char;

          if (r < full_row) {
            char = _str[r * cols + c];
          } else {
            char = _str[cols * full_row + (r - full_row) * (cols - 1) + c];
          }

          output += char;
        }
      }

      return decodeURIComponent(output).replace(/\^/g, '0');
    },

    getArtistDetail(id) {
      var _this7 = this;

      return _asyncToGenerator(function* () {
        try {
          const _ref3 = yield _this7.getDataWithSign('mtop.alimusic.music.artistservice.getartistdetail', {
            artistId: id
          }),
                artistDetailVO = _ref3.artistDetailVO;

          return {
            status: true,
            data: {
              id,
              name: artistDetailVO.artistName,
              avatar: artistDetailVO.artistLogo,
              desc: artistDetailVO.description
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

    getArtistSongs(id, offset, limit) {
      var _this8 = this;

      return _asyncToGenerator(function* () {
        try {
          const detailInfo = yield _this8.getArtistDetail(id);
          const detail = detailInfo.status ? detailInfo.data : {};
          const data = yield _this8.getDataWithSign('mtop.alimusic.music.songservice.getartistsongs', {
            artistId: id,
            backwardOffSale: true,
            pagingVO: {
              page: offset + 1,
              pageSize: limit
            }
          });
          return {
            status: true,
            data: {
              detail,
              songs: data.songs.map(item => {
                return {
                  album: {
                    id: item.albumId,
                    name: item.albumName,
                    cover: item.albumLogo
                  },
                  artists: item.artistVOs.map(artist => {
                    return {
                      id: artist.artistId,
                      name: artist.artistName
                    };
                  }),
                  name: item.songName,
                  id: item.songId,
                  cp: !item.listenFiles
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

    getAlbumDetail(id) {
      var _this9 = this;

      return _asyncToGenerator(function* () {
        try {
          const _ref4 = yield _this9.getDataWithSign('mtop.alimusic.music.list.collectservice.getcollectdetail', {
            listId: id,
            isFullTags: false
          }),
                collectDetail = _ref4.collectDetail;

          return {
            status: true,
            data: {
              id: collectDetail.listId,
              name: collectDetail.collectName,
              cover: collectDetail.collectLogo,
              desc: collectDetail.description
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

    getAlbumSongs(id, offset, limit) {
      var _this10 = this;

      return _asyncToGenerator(function* () {
        try {
          const detailInfo = yield _this10.getAlbumDetail(id);
          const detail = detailInfo.status ? detailInfo.data : {};

          const _ref5 = yield _this10.getDataWithSign('mtop.alimusic.music.list.collectservice.getcollectsongs', {
            listId: id,
            pagingVO: {
              page: offset + 1,
              pageSize: limit
            }
          }),
                songs = _ref5.songs;

          return {
            status: true,
            data: {
              detail,
              songs: songs.map(item => {
                return {
                  album: {
                    id: item.albumId,
                    name: item.albumName,
                    cover: item.albumLogo
                  },
                  artists: item.artistVOs.map(artist => {
                    return {
                      id: artist.artistId,
                      name: artist.artistName
                    };
                  }),
                  name: item.songName,
                  id: item.songId,
                  cp: !item.listenFiles
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
    }

  };
}