'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _instace = require('./instace');

var _instace2 = _interopRequireDefault(_instace);

var _lyric_decode = require('../util/lyric_decode');

var _lyric_decode2 = _interopRequireDefault(_lyric_decode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    searchSong({ keyword, limit = 30, offset = 0 }) {
        return _asyncToGenerator(function* () {
            const params = {
                v: '2.0',
                key: keyword,
                limit: limit,
                page: offset,
                r: 'search/songs',
                app_key: 1
            };
            try {
                let data = yield _instace2.default.post('/web?', params);
                return {
                    status: true,
                    data: {
                        total: data.total,
                        songs: data.songs.map(function (item) {
                            return {
                                album: {
                                    id: item.album_id,
                                    name: item.album_name,
                                    cover: item.album_logo.replace('http', 'https').replace('1.jpg', '2.jpg').replace('1.png', '4.png')
                                },
                                artists: [{
                                    id: item.artist_id,
                                    name: item.artist_name,
                                    avatar: item.artist_logo
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
    getSongUrl(id) {
        var _this = this;

        return _asyncToGenerator(function* () {
            try {
                let data = yield _instace2.default.get(`http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`);
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
        return _asyncToGenerator(function* () {
            let lyric_url;
            try {
                let data = yield _instace2.default.get(`http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`);
                lyric_url = data.trackList[0].lyric_url;
            } catch (e) {
                return {
                    status: true,
                    data: [],
                    log: e
                };
            }
            if (lyric_url) {
                try {
                    let { data } = yield (0, _axios2.default)(lyric_url);
                    return {
                        status: true,
                        data: (0, _lyric_decode2.default)(data)
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
    }
};