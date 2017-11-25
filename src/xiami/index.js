import axios from 'axios'
import instance from './instace'
import lyric_encode from '../util/lyric_decode'

export default {
    async searchSong({keyword, limit = 30, offset = 0}) {
        const params = {
            v: '2.0',
            key: keyword,
            limit: limit,
            page: offset,
            r: 'search/songs',
            app_key: 1
        }
        try {
            let data = await instance.post('/web?', params)
            return {
                status: true,
                data: {
                    total: data.total,
                    songs: data.songs.map(item => {
                        return {
                            album: {
                                id: item.album_id,
                                name: item.album_name,
                                cover: item.album_logo.replace('http', 'https').replace('1.jpg', '2.jpg').replace('1.png', '4.png')
                            },
                            artists: [{
                                id: item.artist_id,
                                name: item.artist_name,
                                avatar: item.artist_logo,
                            }],
                            name: item.song_name,
                            id: item.song_id,
                            cp: !item.listen_file,
                        }
                    })
                }
            }
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async getSongUrl(id) {
        try {
            let data = await instance.get(`http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`)
            return {
                status: true,
                data: {
                    url: this.parseLocation(data.trackList[0].location)
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
    async getLyric(id) {
        let lyric_url
        try {
            let data = await instance.get(`http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`)
            lyric_url = data.trackList[0].lyric_url
        } catch (e) {
            return {
                status: true,
                data: [],
                log: e
            }
        }
        if (lyric_url) {
            try {
                let {data} = await axios(lyric_url)
                return {
                    status: true,
                    data: lyric_encode(data)
                }
            } catch (e) {
                return {
                    status: true,
                    data: [],
                    log: e
                }
            }
        } else {
            return {
                status: true,
                data: [],
                log: '未获取到歌曲url'
            }
        }

    },
    parseLocation(location) {
        let head = parseInt(location.substr(0, 1))
        let _str = location.substr(1)
        let rows = head
        let cols = parseInt(_str.length / rows) + 1
        let output = ''
        let full_row
        for (let i = 0; i < head; i++) {
            if ((_str.length - i) / head === parseInt(_str.length / head)) {
                full_row = i
            }
        }
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < head; r++) {
                if (c === (cols - 1) && r >= full_row) {
                    continue
                }
                let char
                if (r < full_row) {
                    char = _str[r * cols + c]
                } else {
                    char = _str[cols * full_row + (r - full_row) * (cols - 1) + c]
                }
                output += char
            }
        }
        return decodeURIComponent(output).replace(/\^/g, '0')
    }
}