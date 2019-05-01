import {lyric_decode, noSongsDetailMsg} from '../util'

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
}

export default function (instance) {
    // getRestrictLevel方法 来源于网易云音乐web端代码
    const getRestrictLevel = function (bm5r, fC7v) {
        if (!bm5r)
            return 0;
        if (bm5r.program)
            return 0;
        if (fC7v) {
            if (fC7v.st != null && fC7v.st < 0) {
                return 100
            }
            if (fC7v.fee > 0 && fC7v.fee != 8 && fC7v.payed == 0 && fC7v.pl <= 0)
                return 10;
            if (fC7v.fee == 16 || fC7v.fee == 4 && fC7v.flag & 2048)
                return 11;
            if ((fC7v.fee == 0 || fC7v.payed) && fC7v.pl > 0 && fC7v.dl == 0)
                return 1e3;
            if (fC7v.pl == 0 && fC7v.dl == 0)
                return 100;
            return 0
        } else {
            var eA7t = bm5r.status != null ? bm5r.status : bm5r.st != null ? bm5r.st : 0;
            if (bm5r.status >= 0)
                return 0;
            if (bm5r.fee > 0)
                return 10;
            return 100
        }
    }
    // 来自网易云前端 l2x.qA8s
    function qA8s(fB4F) {
        if (fB4F.st != null && fB4F.st < 0) {
            return 100
        }
        if (fB4F.fee > 0 && fB4F.fee != 8 && fB4F.payed == 0 && fB4F.pl <= 0)
            return 10;
        if (fB4F.fee == 16 || fB4F.fee == 4 && fB4F.flag & 2048)
            return 11;
        if ((fB4F.fee == 0 || fB4F.payed) && fB4F.pl > 0 && fB4F.dl == 0)
            return 1e3;
        if (fB4F.pl == 0 && fB4F.dl == 0)
            return 100;
        return 0
    }
    const disable = (song, privilege) => getRestrictLevel(song, privilege) === 100 || qA8s(privilege) === 10
    const getMusicInfo = (info, privilege) => {
        if (!privilege) {
            privilege = info.privilege
        }
        return {
            album: {
                id: info.al.id,
                name: info.al.name,
                cover: info.al.picUrl
            },
            artists: info.ar.map(ar => {
                return {
                    id: ar.id,
                    name: ar.name
                }
            }),
            name: info.name,
            id: info.id,
            cp: disable(info, privilege),
            dl: !privilege.fee,
            quality: {
                192: privilege.maxbr >= 192000,
                320: privilege.maxbr >= 320000,
                999: privilege.maxbr >= 999000,
            },
            mv: info.mv || null,
            vendor: 'netease'
        }
    }
    const getMusicInfo2 = (info, privilege) => {
        if (!privilege) {
            privilege = info.privilege
        }
        return {
            album: {
                id: info.album.id,
                name: info.album.name,
                cover: info.album.picUrl
            },
            artists: info.artists.map(ar => {
                return {
                    id: ar.id,
                    name: ar.name
                }
            }),
            name: info.name,
            id: info.id,
            cp: disable(info, privilege),
            dl: !privilege.fee,
            quality: {
                192: privilege.maxbr >= 192000,
                320: privilege.maxbr >= 320000,
                999: privilege.maxbr >= 999000,
            },
            mv: info.mvid || null,
            vendor: 'netease'
        }
    }
    return {
        instance,
        async searchSong({keyword, limit = 30, offset = 0, type = 1}) {
            // *(type)* 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
            const params = {
                csrf_token: '',
                limit,
                type,
                s: keyword,
                offset,
            }
            try {
                let {result} = await instance.post('/weapi/cloudsearch/get/web', params)
                if (!result) {
                    result = {
                        songCount: 0,
                        songs: []
                    }
                }
                return {
                    status: true,
                    data: {
                        total: result.songCount,
                        songs: result.songs.map(item => getMusicInfo(item))
                    }
                }
            } catch (e) {
                console.warn(e)
                return {
                    status: false,
                    msg: '获取失败',
                    log: e
                }
            }
        },
        async getSongDetail(id) {
            try {
                let data = await instance.post('/weapi/v3/song/detail', {
                    c: JSON.stringify([{id: id}]),
                    ids: '[' + id + ']',
                    csrf_token: ''
                })
                const info = data.songs[0]
                if (!info) {
                    return {
                        status: false,
                        msg: noSongsDetailMsg,
                    }
                }
                return {
                    status: true,
                    data: getMusicInfo(info, data.privileges[0])
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getBatchSongDetail(ids) {
            ids = ids.map(item => parseInt(item))
            try {
                let data = await instance.post('/weapi/v3/song/detail', {
                    c: JSON.stringify(ids.map(item => ({id: item}))),
                    ids: JSON.stringify(ids),
                    csrf_token: ''
                })
                const privilegeObject = {}
                data.privileges.forEach(item => {
                    privilegeObject[item.id] = item
                })
                return {
                    status: true,
                    data: data.songs.map(info => getMusicInfo(info, privilegeObject[info.id]))
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getSongUrl(id, br = 128000) {
            br = parseInt(br)
            const params = {
                ids: [id],
                br,
                csrf_token: ''
            }
            try {
                let {data} = await instance.post('/weapi/song/enhance/player/url', params)
                return {
                    status: true,
                    data: {
                        url: data[0].url,
                        br: data[0].br,
                        size: data[0].size
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '获取失败',
                    log: e
                }
            }
        },
        async getLyric(id) {
            try {
                let data = await instance.post('/weapi/song/lyric?lv=-1&kv=-1&tv=-1', {
                    id
                }, {
                    crypto: 'linuxapi'
                })
                if (data.lrc && data.lrc.lyric) {
                    const translateDecodeData = lyric_decode(data.tlyric.lyric) || []
                    const translate = []
                    for (let i = 0; i < translateDecodeData.length - 1; i++) {
                        if (translateDecodeData[i][1] !== translateDecodeData[i + 1][1]) {
                            translate.push(translateDecodeData[i])
                        }
                    }
                    if (translateDecodeData.length) {
                        translate.push(translateDecodeData.pop())
                    }
                    return {
                        status: true,
                        data: {
                            lyric: lyric_decode(data.lrc.lyric),
                            translate
                        }
                    }
                } else {
                    return {
                        status: true,
                        data: {
                            lyric: [],
                            translate: []
                        }
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getTopList(id) {
            try {
                const {playlist, privileges} = await instance.post('/weapi/v3/playlist/detail', {
                    id: top_list_all[id][1],
                    limit: 30,
                    offset: 0,
                    total: true,
                    n: 1000,
                    csrf_token: ""
                })
                return {
                    status: true,
                    data: {
                        name: playlist.name,
                        description: playlist.description,
                        cover: playlist.coverImgUrl,
                        playCount: playlist.playCount,
                        list: playlist.tracks.map((item, i) => getMusicInfo(item, privileges[i]))
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '获取失败',
                    log: e
                }
            }
        },
        async getComment(rid, page, limit = 20) {
            try {
                let {hotComments, comments, total} = await instance.post('/weapi/v1/resource/comments/R_SO_4_' + rid + '/?csrf_token=', {
                    offset: (page - 1) * limit,
                    rid,
                    limit,
                    csrf_token: ""
                })
                return {
                    status: true,
                    data: {
                        hotComments: hotComments || [],
                        comments: comments || [],
                        total
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getArtistSongs(id, offset, limit) {
            try {
                let data = await instance.post(`/weapi/v1/artist/${id}`, {
                    csrf_token: '',
                    offset,
                    limit
                })
                return {
                    status: true,
                    data: {
                        detail: {
                            id,
                            name: data.artist.name,
                            avatar: data.artist.img1v1Url,
                            desc: data.artist.briefDesc
                        },
                        songs: data.hotSongs.map(item => getMusicInfo(item))
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getPlaylistDetail(id, offset, limit) {
            try {
                const {playlist, privileges} = await instance.post(`/weapi/v3/playlist/detail`, {
                    id,
                    n: limit,
                    s: 8,
                    csrf_token: ""
                })
                let songs = []
                const privilegesObjects = {}
                if (playlist.tracks.length > 1000) {
                    let arr = []
                    const limit = 1000
                    for (let i = 0; i < playlist.tracks.length; i++) {
                        arr.push(playlist.tracks[i].id)
                        // 达到限制 或 已是数组最后一个
                        if (arr.length === limit || i + 1 === playlist.tracks.length) {
                            // 获取详情
                            const data = await this.getBatchSongDetail(arr)
                            if (data.status) {
                                songs = songs.concat(data.data)
                            }
                            // 重置待处理的数组
                            arr = []
                        }
                    }
                } else {
                    privileges.forEach(item => {
                        privilegesObjects[item.id] = item
                    })
                    songs = playlist.tracks.map(item => getMusicInfo(item, privilegesObjects[item.id]))
                }
                return {
                    status: true,
                    data: {
                        detail: {
                            id: playlist.id,
                            name: playlist.name,
                            cover: playlist.coverImgUrl,
                            desc: playlist.description
                        },
                        songs
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getAlbumDetail(id) {
            try {
                const {album, songs} = await instance.post(`/weapi/v1/album/${id}`, {})
                return {
                    status: true,
                    data: {
                        name: album.name,
                        cover: album.picUrl,
                        artist: {
                            id: album.artist.id,
                            name: album.artist.name
                        },
                        desc: album.description,
                        publishTime: album.publishTime,
                        songs: songs.map(item => getMusicInfo(item))
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getBanner() {
            try {
                const {data} = await instance.get('http://music.163.com/discover', {}, {
                    headers: {
                        Referer: "http://music.163.com",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3380.0 Safari/537.36"
                    },
                    pureFly: true
                })
                const pattern = /<script[^>]*>\s*window\.Gbanners\s*=\s*([^;]+?);\s*<\/script>/g;
                const banners = pattern.exec(data)[1]
                return {
                    status: true,
                    data: eval(banners)
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getMvDetail(id) {
            try {
                const {data} = await instance.post(`/weapi/mv/detail`, {
                    id
                })
                return {
                    status: true,
                    data
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getMvComment(id, page = 1, limit = 20) {
            try {
                const data = await instance.post(`/weapi/v1/resource/comments/R_MV_5_${id}/?csrf_token=`, {
                    offset: (page - 1) * limit,
                    rid: id,
                    limit,
                    csrf_token: ""
                })
                return {
                    status: true,
                    data: {
                        total: data.total || 0,
                        hotComments: data.hotComments || [],
                        comments: data.comments || []
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getTopPlaylist(cat = '全部', page = 1, limit = 20) {
            try {
                const data = await instance.post(`/weapi/playlist/highquality/list`, {
                    cat,
                    offset: (page - 1) * limit,
                    limit,
                    csrf_token: ''
                })
                return {
                    status: true,
                    data: data.playlists
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getNewestMvs(limit = 20) {
            try {
                const {data} = await instance.post('/weapi/mv/first', {
                    total: true,
                    limit,
                    csrf_token: ""
                })
                return {
                    status: true,
                    data
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getRecommendSongs(page = 1, limit = 30) {
            try {
                let data = await instance.post(`/weapi/v1/discovery/recommend/songs`, {
                    limit,
                    offset: page - 1,
                    total: true
                })
                return {
                    status: true,
                    data: data.recommend.map(item => getMusicInfo2(item))
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getPersonalizedPlaylist(page = 1, limit = 30) {
            try {
                let data = await instance.post(`/weapi/personalized/playlist`, {
                    limit: 30,
                    offset: page - 1,
                    total: true,
                    n: 1000
                })
                return {
                    status: true,
                    data: data.result
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        }
    }
}