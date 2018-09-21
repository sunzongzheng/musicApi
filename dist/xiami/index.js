"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = require("../util");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const replaceImage = (url = '') => {
  return url.replace('http', 'https').replace('_1.jpg', '_4.jpg').replace('_1.png', '_4.png');
};

function _default(instance, newApiInstance) {
  const getMusicInfo = info => {
    return {
      album: {
        id: info.album_id,
        name: info.album_name,
        cover: replaceImage(info.album_logo || info.logo)
      },
      artists: [{
        id: info.artist_id,
        name: info.artist_name
      }],
      name: info.song_name,
      id: info.song_id,
      cp: !info.listen_file,
      dl: !info.need_pay_flag
    };
  };

  const getMusicInfo2 = info => {
    return {
      album: {
        id: info.albumId,
        name: info.albumName,
        cover: replaceImage(info.albumLogo)
      },
      artists: [{
        id: info.artistId,
        name: info.artistName
      }],
      name: info.songName,
      id: info.songId,
      cp: !info.listenFiles.length,
      dl: !info.needPayFlag
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
              songs: data.songs.map(item => getMusicInfo(item))
            }
          };
        } catch (e) {
          return Promise.reject(e);
        }
      })();
    },

    getSongDetail(id, getRaw = false) {
      return _asyncToGenerator(function* () {
        const params = {
          v: '2.0',
          id,
          r: 'song/detail',
          app_key: 1
        };

        try {
          const _ref = yield instance.post('/web?', params),
                song = _ref.song;

          if (!song.song_id) {
            return {
              status: false,
              msg: _util.noSongsDetailMsg
            };
          }

          if (getRaw) {
            return {
              status: true,
              data: song
            };
          }

          return {
            status: true,
            data: getMusicInfo(song)
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
      return _asyncToGenerator(function* () {
        try {
          const data = yield newApiInstance.get('mtop.alimusic.music.songservice.getsongs', {
            songIds: ids
          });
          return {
            status: true,
            data: data.songs.map(info => getMusicInfo2(info))
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getSongUrl(id) {
      var _this = this;

      return _asyncToGenerator(function* () {
        try {
          let data = yield instance.get(`http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`);
          return {
            status: true,
            data: {
              url: _this.parseLocation(data.trackList[0].location)
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
      var _this2 = this;

      return _asyncToGenerator(function* () {
        let lyric_url;

        try {
          let data = yield _this2.getSongDetail(id, true);

          if (data.status) {
            lyric_url = data.data.lyric;
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
            let _ref2 = yield instance.get(lyric_url, {}, {
              pureFly: true
            }),
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

    getComment(objectId, page, pageSize) {
      return _asyncToGenerator(function* () {
        try {
          const data = yield newApiInstance.get('mtop.alimusic.social.commentservice.getcommentlist', {
            objectId,
            // 会变化
            objectType: 'song',
            pagingVO: {
              page,
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
          return e;
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
      return _asyncToGenerator(function* () {
        try {
          const _ref3 = yield newApiInstance.get('mtop.alimusic.music.artistservice.getartistdetail', {
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
          return e;
        }
      })();
    },

    getArtistSongs(id, offset, limit) {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        try {
          const detailInfo = yield _this3.getArtistDetail(id);
          const detail = detailInfo.status ? detailInfo.data : {};
          const data = yield newApiInstance.get('mtop.alimusic.music.songservice.getartistsongs', {
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
              songs: data.songs.map(item => getMusicInfo2(item))
            }
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getPlaylistDetail(id) {
      return _asyncToGenerator(function* () {
        try {
          const _ref4 = yield newApiInstance.get('mtop.alimusic.music.list.collectservice.getcollectdetail', {
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
          return e;
        }
      })();
    },

    getAlbumSongs(id, offset, limit) {
      var _this4 = this;

      return _asyncToGenerator(function* () {
        try {
          const detailInfo = yield _this4.getPlaylistDetail(id);
          const detail = detailInfo.status ? detailInfo.data : {};

          const _ref5 = yield newApiInstance.get('mtop.alimusic.music.list.collectservice.getcollectsongs', {
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
              songs: songs.map(item => getMusicInfo2(item))
            }
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getAlbumDetail(id) {
      return _asyncToGenerator(function* () {
        try {
          const _ref6 = yield newApiInstance.get('mtop.alimusic.music.albumservice.getalbumdetail', {
            albumId: id
          }),
                albumDetail = _ref6.albumDetail;

          return {
            status: true,
            data: {
              name: albumDetail.albumName,
              cover: albumDetail.albumLogo,
              artist: {
                id: albumDetail.artistId,
                name: albumDetail.artistName
              },
              desc: albumDetail.description,
              publishTime: albumDetail.gmtPublish,
              songs: albumDetail.songs.map(item => getMusicInfo2(item))
            }
          };
        } catch (e) {
          return e;
        }
      })();
    }

  };
}