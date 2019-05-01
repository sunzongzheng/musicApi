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

function _default(instance) {
  const getMusicInfo = info => {
    const purviewRoleVOs = info.purviewRoleVOs;
    const brObject = {};
    purviewRoleVOs.forEach(item => {
      brObject[item.quality] = item.isExist;
    });
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
      dl: !info.needPayFlag,
      quality: {
        192: false,
        320: brObject.h,
        999: brObject.s
      },
      mv: info.mvId || null,
      vendor: 'xiami'
    };
  };

  const getMusicInfo2 = info => {
    const purviewRoleVOs = info.purview_roles;
    const brObject = {};
    purviewRoleVOs.forEach(item => {
      brObject[item.quality] = !item.operation_list[0].upgrade_role;
    });
    return {
      album: {
        id: info.album_id,
        name: info.album_name,
        cover: replaceImage(info.album_logo)
      },
      artists: [{
        id: info.artist_id,
        name: info.artist_name
      }],
      name: info.song_name,
      id: info.song_id,
      cp: !info.listen_file,
      dl: !info.need_pay_flag,
      quality: {
        192: false,
        320: brObject.h,
        999: brObject.s
      },
      mv: null,
      vendor: 'xiami'
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
        try {
          const params = {
            v: '2.0',
            key: keyword,
            limit: limit,
            page: offset + 1,
            r: 'search/songs',
            app_key: 1
          };
          const data = yield instance.post('/web?', params, {
            webApi: true
          });
          return {
            status: true,
            data: {
              total: data.total,
              songs: data.songs.map(item => getMusicInfo2(item))
            }
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getSongDetail(id, getRaw = false) {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('mtop.alimusic.music.songservice.getsongs', {
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
            data: getMusicInfo(info)
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getBatchSongDetail(ids) {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('mtop.alimusic.music.songservice.getsongs', {
            songIds: ids
          });
          return {
            status: true,
            data: data.songs.map(info => getMusicInfo(info))
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getSongUrl(id, br = 128000) {
      var _this = this;

      return _asyncToGenerator(function* () {
        br = parseInt(br);

        try {
          let url;
          const data = yield _this.getSongDetail(id, true);
          const brObject = {};
          data.data.listenFiles.forEach(item => {
            brObject[item.quality] = item.listenFile;
          });

          switch (br) {
            case 128000:
              url = brObject.l;
              break;

            case 320000:
              url = brObject.h;
              break;

            case 999000:
              url = brObject.s;
              break;

            default:
              throw new Error('br有误');
          }

          return {
            status: true,
            data: {
              url
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
            let _ref = yield instance.get(lyric_url, {}, {
              pureFly: true
            }),
                data = _ref.data;

            return {
              status: true,
              data: (0, _util.lyric_decode)(data, true)
            };
          } catch (e) {
            return {
              status: true,
              data: {
                lyric: [],
                translate: []
              },
              log: e
            };
          }
        } else {
          return {
            status: true,
            data: {
              lyric: [],
              translate: []
            },
            log: '未获取到歌曲url'
          };
        }
      })();
    },

    getComment(objectId, page, pageSize) {
      return _asyncToGenerator(function* () {
        try {
          const data = yield instance.get('mtop.alimusic.social.commentservice.getcommentlist', {
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
          const _ref2 = yield instance.get('mtop.alimusic.music.artistservice.getartistdetail', {
            artistId: id
          }),
                artistDetailVO = _ref2.artistDetailVO;

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
          const data = yield instance.get('mtop.alimusic.music.songservice.getartistsongs', {
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
              songs: data.songs.map(item => getMusicInfo(item))
            }
          };
        } catch (e) {
          return e;
        }
      })();
    },

    getPlaylistInfo(id) {
      return _asyncToGenerator(function* () {
        try {
          const _ref3 = yield instance.get('mtop.alimusic.music.list.collectservice.getcollectdetail', {
            listId: id,
            isFullTags: false
          }),
                collectDetail = _ref3.collectDetail;

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

    getPlaylistDetail(id, offset, limit) {
      var _this4 = this;

      return _asyncToGenerator(function* () {
        try {
          const detailInfo = yield _this4.getPlaylistInfo(id);
          const detail = detailInfo.status ? detailInfo.data : {};

          const _ref4 = yield instance.get('mtop.alimusic.music.list.collectservice.getcollectsongs', {
            listId: id,
            pagingVO: {
              page: offset + 1,
              pageSize: limit
            }
          }),
                songs = _ref4.songs;

          return {
            status: true,
            data: {
              detail,
              songs: songs.map(item => getMusicInfo(item))
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
          const _ref5 = yield instance.get('mtop.alimusic.music.albumservice.getalbumdetail', {
            albumId: id
          }),
                albumDetail = _ref5.albumDetail;

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
              songs: albumDetail.songs.map(item => getMusicInfo(item))
            }
          };
        } catch (e) {
          return e;
        }
      })();
    }

  };
}