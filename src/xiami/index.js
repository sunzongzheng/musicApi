import {lyric_decode, noSongsDetailMsg} from '../util'

const replaceImage = (url = '') => {
    return url.replace('http', 'https').replace('_1.jpg', '_4.jpg').replace('_1.png', '_4.png')
}
export default function (instance) {
    const getMusicInfo = (info) => {
        const purviewRoleVOs = info.purviewRoleVOs
        const brObject = {}
        purviewRoleVOs.forEach(item => {
            brObject[item.quality] = item.isExist
        })
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
            dl: !info.needPayFlag,
            quality: {
                192: false,
                320: brObject.h,
                999: brObject.s,
            },
            mv: info.mvId || null,
            vendor: 'xiami'
        }
    }
    const getMusicInfo2 = info => {
        const purviewRoleVOs = info.purview_roles
        const brObject = {}
        purviewRoleVOs.forEach(item => {
            brObject[item.quality] = !item.operation_list[0].upgrade_role
        })
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
            dl: !info.need_pay_flag,
            quality: {
                192: false,
                320: brObject.h,
                999: brObject.s,
            },
            mv: null,
            vendor: 'xiami'
        }
    }
    return {
        instance,
        async searchSong({keyword, limit = 30, offset = 0}) {
            try {
                const params = {
                    v: '2.0',
                    key: keyword,
                    limit: limit,
                    page: offset + 1,
                    r: 'search/songs',
                    app_key: 1
                }
                const data = await instance.post('/web?', params, {
                    webApi: true
                })
                return {
                    status: true,
                    data: {
                        total: data.total,
                        songs: data.songs.map(item => getMusicInfo2(item))
                    }
                }
            } catch (e) {
                return e
            }
        },
        async getSongDetail(id, getRaw = false) {
            try {
                const data = await instance.get('mtop.alimusic.music.songservice.getsongs', {
                    songIds: [id]
                })
                const info = data.songs[0]
                if (!info) {
                    return {
                        status: false,
                        msg: noSongsDetailMsg
                    }
                }
                if (getRaw) {
                    return {
                        status: true,
                        data: info
                    }
                }
                return {
                    status: true,
                    data: getMusicInfo(info)
                }
            } catch (e) {
                return e
            }
        },
        async getBatchSongDetail(ids) {
            try {
                const data = await instance.get('mtop.alimusic.music.songservice.getsongs', {
                    songIds: ids
                })
                return {
                    status: true,
                    data: data.songs.map(info => getMusicInfo(info))
                }
            } catch (e) {
                return e
            }
        },
        async getSongUrl(id, br = 128000) {
            br = parseInt(br)
            try {
                let url
                const data = await this.getSongDetail(id, true)
                const brObject = {}
                data.data.listenFiles.forEach(item => {
                    brObject[item.quality] = item.listenFile
                })
                switch (br) {
                    case 128000:
                        url = brObject.l
                        break
                    case 320000:
                        url = brObject.h
                        break
                    case 999000:
                        url = brObject.s
                        break
                    default:
                        throw new Error('br有误')
                }
                return {
                    status: true,
                    data: {
                        url
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
                    lyric_url = data.data.lyricInfo.lyricFile
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
                    let {data} = await instance.get(lyric_url, {}, {
                        pureFly: true
                    })
                    return {
                        status: true,
                        data: lyric_decode(data, true)
                    }
                } catch (e) {
                    return {
                        status: true,
                        data: {
                            lyric: [],
                            translate: []
                        },
                        log: e
                    }
                }
            } else {
                return {
                    status: true,
                    data: {
                        lyric: [],
                        translate: []
                    },
                    log: '未获取到歌曲url'
                }
            }

        },
        async getComment(objectId, page, pageSize) {
            try {
                const data = await instance.get('mtop.alimusic.social.commentservice.getcommentlist', {
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
                return e
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
                const {artistDetailVO} = await instance.get('mtop.alimusic.music.artistservice.getartistdetail', {
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
                return e
            }
        },
        async getArtistSongs(id, offset, limit) {
            try {
                const detailInfo = await this.getArtistDetail(id)
                const detail = detailInfo.status ? detailInfo.data : {}
                const data = await instance.get('mtop.alimusic.music.songservice.getartistsongs', {
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
                        songs: data.songs.map(item => getMusicInfo(item))
                    }
                }
            } catch (e) {
                return e
            }
        },
        async getPlaylistInfo(id) {
            try {
                const {collectDetail} = await instance.get('mtop.alimusic.music.list.collectservice.getcollectdetail', {
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
                return e
            }
        },
        async getPlaylistDetail(id, offset, limit) {
            try {
                const detailInfo = await this.getPlaylistInfo(id)
                const detail = detailInfo.status ? detailInfo.data : {}
                const {songs} = await instance.get('mtop.alimusic.music.list.collectservice.getcollectsongs', {
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
                        songs: songs.map(item => getMusicInfo(item))
                    }
                }
            } catch (e) {
                return e
            }
        },
        async getAlbumDetail(id) {
            try {
                const {albumDetail} = await instance.get('mtop.alimusic.music.albumservice.getalbumdetail', {
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
                        songs: albumDetail.songs.map(item => getMusicInfo(item))
                    }
                }
            } catch (e) {
                return e
            }
        }
    }
}