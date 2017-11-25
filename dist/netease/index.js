'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _instace = require('./instace');

var _instace2 = _interopRequireDefault(_instace);

var _lyric_decode = require('../util/lyric_decode');

var _lyric_decode2 = _interopRequireDefault(_lyric_decode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    searchSong({ keyword, limit = 30, offset = 0, type = 1 }) {
        return _asyncToGenerator(function* () {
            // *(type)* 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
            const params = {
                csrf_token: '',
                limit,
                type,
                s: keyword,
                offset
            };
            try {
                let { result } = yield _instace2.default.post('/weapi/cloudsearch/get/web', params);
                return {
                    status: true,
                    data: {
                        total: result.songCount,
                        songs: result.songs.map(function (item) {
                            return {
                                album: {
                                    id: item.al.id,
                                    name: item.al.name,
                                    cover: item.al.picUrl
                                },
                                artists: item.ar,
                                name: item.name,
                                id: item.id,
                                cp: !item.privilege.cp
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
    getSongUrl(id) {
        return _asyncToGenerator(function* () {
            return {
                status: true,
                data: {
                    url: `http://music.163.com/song/media/outer/url?id=${id}.mp3`
                }
            };
            const params = {
                ids: [id],
                br: 999000,
                csrf_token: ''
            };
            try {
                let { data } = yield _instace2.default.post('/weapi/song/enhance/player/url', params);
            } catch (e) {
                return e;
            }
        })();
    },
    getLyric(id) {
        return _asyncToGenerator(function* () {
            try {
                let data = yield _instace2.default.post('/weapi/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1', {});
                if (data.lrc && data.lrc.lyric) {
                    return {
                        status: true,
                        data: (0, _lyric_decode2.default)(data.lrc.lyric)
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
    }
};