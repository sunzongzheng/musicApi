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

const top_list_all = {
    "0": ["云音乐新歌榜", "3779629"],
    "1": ["云音乐热歌榜", "3778678"],
    "2": ["网易原创歌曲榜", "2884035"],
    "3": ["云音乐飙升榜", "19723756"],
    "4": ["云音乐电音榜", "10520166"],
    "5": ["UK排行榜周榜", "180106"],
    "6": ["美国Billboard周榜", "60198"],
    "7": ["KTV嗨榜", "21845217"],
    "8": ["iTunes榜", "11641012"],
    "9": ["Hit FM Top榜", "120001"],
    "10": ["日本Oricon周榜", "60131"],
    "11": ["韩国Melon排行榜周榜", "3733003"],
    "12": ["韩国Mnet排行榜周榜", "60255"],
    "13": ["韩国Melon原声周榜", "46772709"],
    "14": ["中国TOP排行榜(港台榜)", "112504"],
    "15": ["中国TOP排行榜(内地榜)", "64016"],
    "16": ["香港电台中文歌曲龙虎榜", "10169002"],
    "17": ["华语金曲榜", "4395559"],
    "18": ["中国嘻哈榜", "1899724"],
    "19": ["法国 NRJ EuroHot 30周榜", "27135204"],
    "20": ["台湾Hito排行榜", "112463"],
    "21": ["Beatport全球电子舞曲榜", "3812895"]
};
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
    },
    getTopList(id) {
        return _asyncToGenerator(function* () {
            try {
                const { playlist, privileges } = yield _instace2.default.post('/weapi/v3/playlist/detail', {
                    id: top_list_all[id][1],
                    limit: 30,
                    offset: 0,
                    total: true,
                    n: 1000,
                    csrf_token: ""
                });
                return {
                    status: true,
                    data: {
                        name: playlist.name,
                        description: playlist.description,
                        cover: playlist.coverImgUrl,
                        playCount: playlist.playCount,
                        list: playlist.tracks.map(function (item, i) {
                            return {
                                album: {
                                    id: item.al.id,
                                    name: item.al.name,
                                    cover: item.al.picUrl
                                },
                                artists: item.ar,
                                name: item.name,
                                id: item.id,
                                cp: !privileges[i].cp
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