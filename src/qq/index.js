import {lyric_decode, noSongsDetailMsg} from '../util'

export default function (instance) {
    const getMusicInfo = (info) => {
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
            name: info.name,
            id: info.id,
            cp: !info.action.alert,
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
        async getSongUrl(songid, level = 'normal') {
            const guid = Math.floor(Math.random() * 1000000000)
            let data
            try {
                const {key} = await instance.get('/base/fcgi-bin/fcg_musicexpress.fcg', {
                    json: 3,
                    guid: guid
                })
                const mid = await this.getMid(songid)
                switch (level) {
                    case 'high':
                        data = {
                            status: true,
                            data: {
                                url: `http://dl.stream.qqmusic.qq.com/M800${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                            }
                        }
                        break
                    case 'normal':
                        data = {
                            status: true,
                            data: {
                                url: `http://dl.stream.qqmusic.qq.com/M500${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                            }
                        }
                        break
                    case 'low':
                        data = {
                            status: true,
                            data: {
                                url: `http://ws.stream.qqmusic.qq.com/C100${mid}.m4a?fromtag=38`
                            }
                        }
                        break
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
                        data: lyric_decode(new Buffer(data.lyric, 'base64').toString())
                    }
                } else {
                    return {
                        status: true,
                        data: []
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
        async getComment(songid, pagenum = 0, pagesize = 20) {
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
                    pagenum,
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
                        songs: data.list.map(item => {
                            const info = item.musicData
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
                                cp: !info.alertid,
                            }
                        })
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
                        songs: cdlist[0].songlist.map(info => {
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
                                cp: !info.alertid,
                            }
                        })
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
        async getArtists(offset = 0, limit = 80) {
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
                                area: -100,
                                sex: -100,
                                genre: -100,
                                index: -100,
                                sin: offset * limit,
                                cur_page: offset + 1,
                            }
                        }
                    })
                },{
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
        }
    }
}