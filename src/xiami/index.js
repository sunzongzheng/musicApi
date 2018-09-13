import fly from "flyio"
import {lyric_decode, noSongsDetailMsg, getCookies, setCookie} from '../util'
import Crypto from './crypto'

let cache = getCache()

function getCache() {
    if (typeof(window) !== 'undefined') {
        const cookies = getCookies()
        if (cookies['_m_h5_tk'] && cookies['_m_h5_tk_enc']) {
            return {
                token: [
                    `_m_h5_tk=${cookies['_m_h5_tk']}`,
                    `_m_h5_tk_enc${cookies['_m_h5_tk_enc']}`
                ],
                signedToken: cookies['_m_h5_tk'].split('_')[0],
                expire: +new Date() + 365 * 24 * 60 * 1000, // 浏览器环境 此字段无效 以cookie有效期为准
            }
        } else {
            return {
                token: null,
                signedToken: null
            }
        }
    } else {
        return {
            token: null,
            signedToken: null
        }
    }
}

function setCache({token, signedToken}) {
    cache = {
        token,
        signedToken,
        expire: +new Date() + 7 * 24 * 60 * 1000, // 7天有效 浏览器环境此字段无效
    }
    // 浏览器环境 存cookie
    if (typeof(window) !== 'undefined') {
        token.forEach(item => {
            const arr = item.split('=')
            setCookie(arr[0], arr[1])
        })
    }
}

const replaceImage = (url = '') => {
    return url.replace('http', 'https').replace('_1.jpg', '_4.jpg').replace('_1.png', '_4.png')
}
export default function (instance, newApiInstance) {
    const getMusicInfo = (info) => {
        return {
            album: {
                id: info.album_id,
                name: info.album_name,
                cover: replaceImage(info.album_logo)
            },
            artists: [{
                id: info.artist_id,
                name: info.artist_name
            }],
            name: info.song_name,
            id: info.song_id,
            cp: !info.listen_file,
            dl: !info.need_pay_flag
        }
    }
    const getMusicInfo2 = (info) => {
        return {
            album: {
                id: info.albumId,
                name: info.albumName,
                cover: replaceImage(info.albumLogo)
            },
            artists: [{
                id: info.artistId,
                name: info.artistName
            }],
            name: info.songName,
            id: info.songId,
            cp: !info.listenFiles.length,
            dl: !info.needPayFlag
        }
    }
    return {
        // 根据api获取虾米token
        async getXiamiToken(api) {
            if (cache.token && cache.signedToken && +new Date() <= cache.expire) {
                return cache
            }
            try {
                await newApiInstance.get(`/${api}/1.0/`)
            } catch (res) {
                if (res.status === 200) {
                    let token = res.headers['set-cookie'].split('Path=/,')
                    token = token.map(i => i.split(';')[0].trim())
                    const myToken = token[0].replace('_m_h5_tk=', '').split('_')[0]
                    setCache({
                        token,
                        signedToken: myToken
                    })
                    return cache
                } else {
                    return Promise.reject({
                        msg: '获取token失败'
                    })
                }
            }
        },
        // 根据签名token获取数据
        async getDataWithSign(api, model) {
            const {token, signedToken} = await this.getXiamiToken(api)
            const appKey = 12574478
            const queryStr = JSON.stringify({
                requestStr: JSON.stringify({
                    header: {
                        appId: 200,
                        appVersion: 1000000,
                        callId: new Date().getTime(),
                        network: 1,
                        platformId: 'mac',
                        remoteIp: '192.168.1.101',
                        resolution: '1178*778',
                    },
                    model
                })
            })
            const t = new Date().getTime()
            const sign = Crypto.MD5(
                `${signedToken}&${t}&${appKey}&${queryStr}`
            )
            return await newApiInstance.get(`/${api}/1.0/`, {
                appKey, // 会变化
                t, // 会变化
                sign, // 会变化
                api,
                v: '1.0',
                type: 'originaljson',
                dataType: 'json', // 会变化
                data: queryStr
            }, {
                headers: {
                    'cookie': token.join(';'), // 会变化
                }
            })
        },
        async searchSong({keyword, limit = 30, offset = 0}) {
            const params = {
                v: '2.0',
                key: keyword,
                limit: limit,
                page: offset + 1,
                r: 'search/songs',
                app_key: 1
            }
            try {
                let data = await instance.post('/web?', params)
                return {
                    status: true,
                    data: {
                        total: data.total,
                        songs: data.songs.map(item => getMusicInfo(item))
                    }
                }
            } catch (e) {
                return Promise.reject(e)
            }
        },
        async getSongDetail(id, getRaw = false) {
            const params = {
                v: '2.0',
                id,
                r: 'song/detail',
                app_key: 1
            }
            try {
                const {song} = await instance.post('/web?', params)
                if (!song.song_id) {
                    return {
                        status: false,
                        msg: noSongsDetailMsg,
                    }
                }
                if (getRaw) {
                    return {
                        status: true,
                        data: song
                    }
                }
                return {
                    status: true,
                    data: getMusicInfo(song)
                }
            } catch (e) {
                console.warn(e)
                if (e.status === 200) {
                    return {
                        status: false,
                        msg: e.ret[0].slice('::')[1],
                        log: e
                    }
                } else {
                    return {
                        status: false,
                        msg: '请求失败',
                        log: e
                    }
                }
            }
        },
        async getBatchSongDetail(ids) {
            try {
                const data = await this.getDataWithSign('mtop.alimusic.music.songservice.getsongs', {
                    songIds: ids
                })
                return {
                    status: true,
                    data: data.songs.map(info => getMusicInfo2(info))
                }
            } catch (e) {
                console.warn(e)
                if (e.status === 200) {
                    return {
                        status: false,
                        msg: e.ret[0].slice('::')[1],
                        log: e
                    }
                } else {
                    return {
                        status: false,
                        msg: '请求失败',
                        log: e
                    }
                }
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
                let data = await this.getSongDetail(id, true)
                if (data.status) {
                    lyric_url = data.data.lyric
                } else {
                    return {
                        status: false,
                        data: [],
                        log: data.log
                    }
                }
            } catch (e) {
                return {
                    status: true,
                    data: [],
                    log: e
                }
            }
            if (lyric_url) {
                try {
                    let {data} = await fly.get(lyric_url)
                    return {
                        status: true,
                        data: lyric_decode(data)
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
        async getComment(objectId, page, pageSize) {
            try {
                const data = await this.getDataWithSign('mtop.alimusic.social.commentservice.getcommentlist', {
                    objectId, // 会变化
                    objectType: 'song',
                    pagingVO: {
                        page,
                        pageSize
                    }
                })
                return {
                    status: true,
                    data: {
                        hotComments: [],
                        comments: data.commentVOList || [],
                        total: data.pagingVO.count
                    }
                }
            } catch (e) {
                console.warn(e)
                if (e.status === 200) {
                    return {
                        status: false,
                        msg: e.ret[0].slice('::')[1],
                        log: e
                    }
                } else {
                    return {
                        status: false,
                        msg: '请求失败',
                        log: e
                    }
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
        },
        async getArtistDetail(id) {
            try {
                const {artistDetailVO} = await this.getDataWithSign('mtop.alimusic.music.artistservice.getartistdetail', {
                    artistId: id
                })
                return {
                    status: true,
                    data: {
                        id,
                        name: artistDetailVO.artistName,
                        avatar: artistDetailVO.artistLogo,
                        desc: artistDetailVO.description
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
        async getArtistSongs(id, offset, limit) {
            try {
                const detailInfo = await this.getArtistDetail(id)
                const detail = detailInfo.status ? detailInfo.data : {}
                const data = await this.getDataWithSign('mtop.alimusic.music.songservice.getartistsongs', {
                    artistId: id,
                    backwardOffSale: true,
                    pagingVO: {
                        page: offset + 1,
                        pageSize: limit
                    }
                })
                return {
                    status: true,
                    data: {
                        detail,
                        songs: data.songs.map(item => getMusicInfo2(item))
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
        async getPlaylistDetail(id) {
            try {
                const {collectDetail} = await this.getDataWithSign('mtop.alimusic.music.list.collectservice.getcollectdetail', {
                    listId: id,
                    isFullTags: false
                })
                return {
                    status: true,
                    data: {
                        id: collectDetail.listId,
                        name: collectDetail.collectName,
                        cover: collectDetail.collectLogo,
                        desc: collectDetail.description
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
        async getAlbumSongs(id, offset, limit) {
            try {
                const detailInfo = await this.getPlaylistDetail(id)
                const detail = detailInfo.status ? detailInfo.data : {}
                const {songs} = await this.getDataWithSign('mtop.alimusic.music.list.collectservice.getcollectsongs', {
                    listId: id,
                    pagingVO: {
                        page: offset + 1,
                        pageSize: limit
                    }
                })
                return {
                    status: true,
                    data: {
                        detail,
                        songs: songs.map(item => getMusicInfo2(item))
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
        async getAlbumDetail(id) {
            try {
                const {albumDetail} = await this.getDataWithSign('mtop.alimusic.music.albumservice.getalbumdetail', {
                    albumId: id
                })
                return {
                    status: true,
                    data: {
                        name: albumDetail.albumName,
                        cover: albumDetail.albumLogo,
                        artist: {
                            id: albumDetail.artistId,
                            name: albumDetail.artistName
                        },
                        desc: albumDetail.description,
                        publishTime: albumDetail.gmtPublish,
                        songs: albumDetail.songs.map(item => getMusicInfo2(item))
                    }
                }
            } catch (e) {
                console.warn(e)
                if (e.status === 200) {
                    return {
                        status: false,
                        msg: e.ret[0].slice('::')[1],
                        log: e
                    }
                } else {
                    return {
                        status: false,
                        msg: '请求失败',
                        log: e
                    }
                }
            }
        }
    }
}