import instace from './instace'
import lyric_encode from '../util/lyric_decode'

export default {
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
            let {result} = await instace.post('/weapi/cloudsearch/get/web', params)
            return {
                status: true,
                data: {
                    total: result.songCount,
                    songs: result.songs.map(item => {
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
    async getSongUrl(id) {
        return {
            status: true,
            data: {
                url: `http://music.163.com/song/media/outer/url?id=${id}.mp3`
            }
        }
        const params = {
            ids: [id],
            br: 999000,
            csrf_token: ''
        }
        try {
            let {data} = await instace.post('/weapi/song/enhance/player/url', params)
        } catch (e) {
            return e
        }
    },
    async getLyric(id) {
        try {
            let data = await instace.post('/weapi/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1', {})
            if (data.lrc && data.lrc.lyric) {
                return {
                    status: true,
                    data: lyric_encode(data.lrc.lyric)
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