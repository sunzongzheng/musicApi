"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../types/flyio.d.ts"/>
var music_api_class_1 = __importDefault(require("../music.api.class"));
var fly_1 = __importDefault(require("flyio/dist/npm/fly"));
var set_api_1 = __importDefault(require("./set-api"));
var QQ = /** @class */ (function (_super) {
    __extends(QQ, _super);
    function QQ(adapter) {
        var _this = _super.call(this, adapter) || this;
        _this.Api = new fly_1.default(_this.engine);
        set_api_1.default(_this.Api);
        return _this;
    }
    QQ.prototype.getMusicInfo = function (song) {
        var file = song.file;
        var maxbr = 128000;
        if (song.file.size_flac) {
            maxbr = 999000;
        }
        else if (file.size_320 || file.size_320mp3) {
            maxbr = 320000;
        }
        return {
            album: {
                id: song.album.id,
                name: song.album.name,
                cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000" + song.album.mid + ".jpg",
            },
            artists: song.singer.map(function (singer) {
                return {
                    id: singer.id,
                    name: singer.name
                };
            }),
            name: song.title,
            songId: song.id,
            cp: song.action.msg === 3 || !song.interval,
            maxbr: maxbr,
            mv: song.mv.vid || null,
            vendor: 'qq'
        };
    };
    QQ.prototype.search = function (_a) {
        var _b = _a.keyword, keyword = _b === void 0 ? '' : _b, _c = _a.limit, limit = _c === void 0 ? 30 : _c, _d = _a.page, page = _d === void 0 ? 1 : _d, _e = _a.type, type = _e === void 0 ? 'song' : _e;
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        params = {
                            p: page,
                            n: limit,
                            w: keyword,
                            ct: 24,
                            remoteplace: 'txt.yqq.song',
                            aggr: 1,
                            cr: 1,
                            lossless: 0,
                        };
                        return [4 /*yield*/, this.Api.get('/soso/fcgi-bin/client_search_cp', params)];
                    case 1:
                        data = _f.sent();
                        return [2 /*return*/, {
                                total: data.data.song.totalnum,
                                songs: data.data.song.list.map(function (item) { return _this.getMusicInfo(item); })
                            }];
                }
            });
        });
    };
    QQ.prototype.getSongDetail = function (ids, raw) {
        if (raw === void 0) { raw = false; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkId(ids);
                        return [4 /*yield*/, this.Api.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
                                songid: ids.join(','),
                                tpl: 'yqq_song_detail',
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, raw ? data : data.map(function (item) { return _this.getMusicInfo(item); })];
                }
            });
        });
    };
    QQ.prototype.getMid = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var detailInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSongDetail([id], true)];
                    case 1:
                        detailInfo = _a.sent();
                        return [2 /*return*/, detailInfo[0].mid];
                }
            });
        });
    };
    QQ.prototype.getSongUrl = function (id, br) {
        if (br === void 0) { br = 128; }
        return __awaiter(this, void 0, void 0, function () {
            var guid, key, mid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkBr(br);
                        guid = Math.floor(Math.random() * 1000000000);
                        return [4 /*yield*/, this.Api.get('/base/fcgi-bin/fcg_musicexpress.fcg', {
                                json: 3,
                                guid: guid
                            })];
                    case 1:
                        key = (_a.sent()).key;
                        return [4 /*yield*/, this.getMid(id)];
                    case 2:
                        mid = _a.sent();
                        switch (br) {
                            case 128:
                                return [2 /*return*/, "http://183.131.60.16/amobile.music.tc.qq.com/M500" + mid + ".mp3?vkey=" + key + "&guid=" + guid + "&fromtag=30"];
                            case 320:
                                return [2 /*return*/, "http://183.131.60.16/amobile.music.tc.qq.com/M800" + mid + ".mp3?vkey=" + key + "&guid=" + guid + "&fromtag=30"];
                            case 999:
                                return [2 /*return*/, "http://183.131.60.16/amobile.music.tc.qq.com/F000" + mid + ".flac?vkey=" + key + "&guid=" + guid + "&fromtag=54"];
                            default:
                                return [2 /*return*/, ''];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return QQ;
}(music_api_class_1.default));
exports.default = QQ;
//# sourceMappingURL=index.js.map