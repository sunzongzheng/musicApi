import fly from "flyio"
import {lyric_decode, noSongsDetailMsg} from '../util'
import Crypto from './crypto'

let cache = {
    token: null,
    signedToken: null,
    expire: null
}
const replaceImage = (url) => {
    return url.replace('http', 'https').replace('_1.jpg', '_4.jpg').replace('_1.png', '_4.png')
}
export default function (instance, newApiInstance) {
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
                    cache = {
                        token,
                        signedToken: myToken,
                        expire: +new Date() + 5 * 60 * 1000
                    }
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
                        songs: data.songs.map(item => {
                            return {
                                album: {
                                    id: item.album_id,
                                    name: item.album_name,
                                    cover: replaceImage(item.album_logo)
                                },
                                artists: [{
                                    id: item.artist_id,
                                    name: item.artist_name
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
                    data: {
                        album: {
                            id: song.album_id,
                            name: song.album_name,
                            cover: replaceImage(song.logo)
                        },
                        artists: [{
                            id: song.artist_id,
                            name: song.artist_name
                        }],
                        name: song.song_name,
                        id: song.song_id,
                        cp: !song.listen_file,
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
        async getBatchSongDetail(ids) {
            try {
                const data = await this.getDataWithSign('mtop.alimusic.music.songservice.getsongs', {
                    songIds: ids
                })
                return {
                    status: true,
                    data: data.songs.map(info => {
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
                        }
                    })
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
        async getComment(objectId, offset, pageSize) {
            try {
                const data = await this.getDataWithSign('mtop.alimusic.social.commentservice.getcommentlist', {
                    objectId, // 会变化
                    objectType: 'song',
                    pagingVO: {
                        page: offset + 1,
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
                        songs: data.songs.map(item => {
                            return {
                                album: {
                                    id: item.albumId,
                                    name: item.albumName,
                                    cover: item.albumLogo
                                },
                                artists: item.artistVOs.map(artist => {
                                    return {
                                        id: artist.artistId,
                                        name: artist.artistName
                                    }
                                }),
                                name: item.songName,
                                id: item.songId,
                                cp: !item.listenFiles.length,
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
                        songs: songs.map(item => {
                            return {
                                album: {
                                    id: item.albumId,
                                    name: item.albumName,
                                    cover: item.albumLogo
                                },
                                artists: item.artistVOs.map(artist => {
                                    return {
                                        id: artist.artistId,
                                        name: artist.artistName
                                    }
                                }),
                                name: item.songName,
                                id: item.songId,
                                cp: !item.listenFiles.length,
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
                        songs: albumDetail.songs.map(item => {
                            return {
                                album: {
                                    id: item.albumId,
                                    name: item.albumName,
                                    cover: replaceImage(item.albumLogo)
                                },
                                artists: item.artistVOs.map(singer => {
                                    return {
                                        id: singer.artistId,
                                        name: singer.artistName
                                    }
                                }),
                                name: item.songName,
                                id: item.songId,
                                cp: !item.listenFiles.length,
                            }
                        })
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