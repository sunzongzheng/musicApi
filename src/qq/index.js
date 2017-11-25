import instace from './instace'
import lyric_encode from '../util/lyric_decode'

export default {
    async searchSong({keyword, limit = 30, offset = 0}) {
        const params = {
            p: offset,
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
            let data = await instace.get('/soso/fcgi-bin/client_search_cp', {
                params
            })
            return {
                status: true,
                data: {
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
                            cp: !item.action.alert,
                        }
                    })
                }
            }
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async getSongUrl(id, level = 'normal') {
        const guid = Math.floor(Math.random() * 1000000000)
        let data
        try {
            const {key} = await instace.get('https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg', {
                params: {
                    json: 3,
                    guid: guid
                }
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
            let data = await instace.get('http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
                params: {
                    'callback': 'MusicJsonCallback_lrc',
                    'pcachetime': Date.parse(new Date()),
                    'songmid': id,
                    'g_tk': 5381,
                    'jsonpCallback': 'MusicJsonCallback_lrc',
                    'loginUin': 0,
                    'hostUin': 0,
                    'format': 'jsonp',
                    'inCharset': 'utf8',
                    'outCharset': 'utf-8',
                    'notice': 0,
                    'platform': 'yqq',
                    'needNewCode': 0
                }
            })
            if (data.lyric) {
                return {
                    status: true,
                    data: lyric_encode(new Buffer(data.lyric, 'base64').toString())
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

    }
}