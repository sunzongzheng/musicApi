import {lyric_decode} from '../util'

export default function (instance) {
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
                        keyword: data.data.keyword,
                        total: data.data.song.totalnum,
                        songs: data.data.song.list.map(item => {
                            return {
                                album: {
                                    id: item.album.id,
                                    name: item.album.name,
                                    cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.album.mid}.jpg`,
                                },
                                artists: item.singer,
                                name: item.name,
                                id: item.mid,
                                commentId: item.id,
                                cp: !item.action.alert,
                            }
                        })
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
        async getSongDetail(songmid) {
            try {
                const data = await instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
                    songmid,
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
                return {
                    status: true,
                    data: {
                        album: {
                            id: info.album.id,
                            name: info.album.name,
                            cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`,
                        },
                        artists: info.singer,
                        name: info.name,
                        id: info.mid,
                        commentId: info.id,
                        cp: !info.action.alert,
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
        async getBatchSongDetail(songmids) {
            try {
                const data = await instance.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
                    songmid: songmids.join(','),
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
                    data: data.data.map(info => {
                        return {
                            album: {
                                id: info.album.id,
                                name: info.album.name,
                                cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`,
                            },
                            artists: info.singer,
                            name: info.name,
                            id: info.mid,
                            commentId: info.id,
                            cp: !info.action.alert,
                        }
                    })
                }
            } catch (e) {
                return {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
        },
        async getSongUrl(id, level = 'normal') {
            const guid = Math.floor(Math.random() * 1000000000)
            let data
            try {
                const {key} = await instance.get('/base/fcgi-bin/fcg_musicexpress.fcg', {
                    json: 3,
                    guid: guid
                })
                switch (level) {
                    case 'high':
                        data = {
                            status: true,
                            data: {
                                url: `http://dl.stream.qqmusic.qq.com/M800${id}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                            }
                        }
                        break
                    case 'normal':
                        data = {
                            status: true,
                            data: {
                                url: `http://dl.stream.qqmusic.qq.com/M500${id}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
                            }
                        }
                        break
                    case 'low':
                        data = {
                            status: true,
                            data: {
                                url: `http://ws.stream.qqmusic.qq.com/C100${id}.m4a?fromtag=38`
                            }
                        }
                        break
                }
            } catch (e) {
                data = {
                    status: false,
                    msg: '请求失败',
                    log: e
                }
            }
            return data
        },
        async getLyric(id) {
            try {
                let data = await instance.get('/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
                    'callback': 'callback',
                    'pcachetime': Date.parse(new Date()),
                    'songmid': id,
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
                    msg: '请求失败',
                    log: e
                }
            }

        },
        async getComment(topid, pagenum = 0, pagesize = 20) {
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
                    topid,
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
                        hotComments: hot_comment ? hot_comment.commentlist : [],
                        comments: comment.commentlist,
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
        }
    }
}