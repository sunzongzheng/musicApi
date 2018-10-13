import {lyric_decode, noSongsDetailMsg} from '../util'

export default function (instance) {
    const getMusicInfo = (info) => {
        const file = info.file
        return {
            album: {
                id: info.album.id,
                name: info.album.name,
                cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`,
            },
            artists: info.singer.map(singer => {
                return {
                    id: singer.id,
                    name: singer.name
                }
            }),
            name: info.title,
            id: info.id,
            cp: info.action.msg === 3 || !info.interval,
            dl: !info.pay.pay_down,
            quality: {
                // 192: Boolean(file.size_aac || file.size_192aac || file.size_ogg || file.size_192ogg),
                192: false,
                320: Boolean(file.size_320 || file.size_320mp3),
                999: Boolean(info.file.size_flac),
            }
        }
    }
    const getMusicInfo2 = (info) => {
        return {
            album: {
                id: info.albumid,
                name: info.albumname,
                cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.albummid}.jpg`,
            },
            artists: info.singer.map(singer => {
                return {
                    id: singer.id,
                    name: singer.name
                }
            }),
            name: info.songname,
            id: info.songid,
            cp: info.msgid === 3 || !info.interval,
            dl: !info.pay.paydownload,
            quality: {
                // 192: Boolean(info.sizeogg),
                192: false,
                320: Boolean(info.size320),
                999: Boolean(info.sizeflac),
            }
        }
    }
    return {
        async searchSong({keyword, limit = 30, offset = 0}) {
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
            }
            try {
                let data = await instance.get('/soso/fcgi-bin/client_search_cp', params)
                return {
                    status: true,
                    data: {
                        total: data.data.song.totalnum,
                        songs: data.data.song.list.map(item => getMusicInfo(item))
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
        async getSongDetail(id, raw = false, type = 'songid') {
            try {
                const data = await instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
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
                })
                const info = data.data[0]
                if (!info) {
                    return {
                        status: false,
                        msg: noSongsDetailMsg,
                    }
                }
                return {
                    status: true,
                    data: raw ? info : getMusicInfo(info)
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getBatchSongDetail(songids) {
            try {
                const data = await instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
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
                })
                return {
                    status: true,
                    data: data.data.map(item => getMusicInfo(item))
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getMid(id) {
            const detailInfo = await this.getSongDetail(id, true)
            if (!detailInfo.status) {
                throw new Error(detailInfo.msg)
            }
            return detailInfo.data.mid
        },
        async getSongUrl(songid, br = 128000) {
            const guid = Math.floor(Math.random() * 1000000000)
            let data
            try {
                const {key} = await instance.get('/base/fcgi-bin/fcg_musicexpress.fcg', {
                    json: 3,
                    guid: guid
                })
                const mid = await this.getMid(songid)
                switch (br) {
                    case 128000:
                        data = {
                            status: true,
                            data: {
                                url: `http://dl.stream.qqmusic.qq.com/M500${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                            }
                        }
                        break
                    case 320000:
                        data = {
                            status: true,
                            data: {
                                url: `http://dl.stream.qqmusic.qq.com/M800${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                            }
                        }
                        break
                    case 999000:
                        data = {
                            status: true,
                            data: {
                                url: `http://dl.stream.qqmusic.qq.com/F000${mid}.flac?vkey=${key}&guid=${guid}&fromtag=54`
                            }
                        }
                        break
                    default:
                        throw new Error('br有误')
                }
            } catch (e) {
                data = {
                    status: false,
                    msg: e.message || '请求失败',
                    log: e
                }
            }
            return data
        },
        async getLyric(songid) {
            try {
                const mid = await this.getMid(songid)
                let data = await instance.get('/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
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
                })
                if (data.lyric) {
                    return {
                        status: true,
                        data: {
                            lyric: lyric_decode(new Buffer(data.lyric, 'base64').toString()),
                            translate: lyric_decode(new Buffer(data.trans, 'base64').toString()),
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
                    msg: e.message || '请求失败',
                    log: e
                }
            }

        },
        async getComment(songid, page, pagesize = 20) {
            try {
                const {comment, hot_comment} = await instance.get('/base/fcgi-bin/fcg_global_comment_h5.fcg', {
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
                    domain: 'qq.com',
                })
                return {
                    status: true,
                    data: {
                        hotComments: (hot_comment && hot_comment.commentlist) ? hot_comment.commentlist : [],
                        comments: comment.commentlist || [],
                        total: comment.commenttotal
                    }
                }
            } catch (e) {
                console.warn(e)
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getArtistSongs(id, offset, limit) {
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
                }
                const {data} = await instance.get('/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', params)
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
                }
            } catch (e) {
                console.warn(e)
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getAlbumSongs(id, offset, limit) {
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
                }
                const {cdlist} = await instance.get('/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg', params)
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
                }
            } catch (e) {
                console.warn(e)
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getArtists(offset = 0, param) {
            const {area = -100, sex = -100, genre = -100, index = -100} = param || {}
            try {
                const {singerList} = await instance.get('/cgi-bin/musicu.fcg', {
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
                                cur_page: offset + 1,
                            }
                        }
                    })
                }, {
                    headers: {
                        newApi: true
                    }
                })
                return {
                    status: true,
                    data: singerList.data
                }
            } catch (e) {
                console.warn(e)
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getAlbumDetail(id) {
            try {
                const {data} = await instance.get('https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg', {
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
                })
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
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getAllTopList() {
            const params = {
                page: 'index',
                format: 'html',
                tpl: 'macv4',
                v8debug: 1,
                jsonCallback: 'jsonCallback'
            }
            try {
                let data = await instance.get('/v8/fcg-bin/fcg_v8_toplist_opt.fcg', params, {
                    nocode: true
                })
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
                                }
                            })
                        }
                    })
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '获取失败',
                    log: e
                }
            }
        },
        async getTopList(id) {
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
            }
            try {
                let data = await instance.get('/v8/fcg-bin/fcg_v8_toplist_cp.fcg', params)
                return {
                    status: true,
                    data: {
                        name: data.topinfo.ListName,
                        description: data.topinfo.info,
                        cover: data.topinfo.MacDetailPicUrl,
                        playCount: data.topinfo.listennum,
                        list: data.songlist.map(item => getMusicInfo2(item.data))
                    }
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '获取失败',
                    log: e
                }
            }
        }
    }
}