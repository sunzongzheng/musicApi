import Netease from './netease'
import QQ from './qq'
import Xiami from './xiami'
import neteaseBase from './netease/instance/base'
import qqBase from './qq/instance/base'
import xiamiBase from './xiami/instance/base'

export default function (instance) {
    const provider = {
        netease: Netease(neteaseBase(instance)),
        qq: QQ(qqBase(instance)),
        xiami: Xiami(xiamiBase(instance))
    }

    const vendors = ['netease', 'qq', 'xiami']
    const paramsVerify = (vendor, id) => {
        // 参数校验
        if (!vendors.includes(vendor)) {
            return Promise.reject({
                status: false,
                msg: 'vendor错误'
            })
        }
        if (!id || Array.isArray(id) && !id.length) {
            return Promise.reject({
                status: false,
                msg: 'id不能为空'
            })
        }
    }
    const getData = async (api, params, errorResponse) => {
        let netease_rs = await provider.netease[api](params)
        netease_rs = netease_rs.status ? netease_rs.data : errorResponse
        let qq_rs = await provider.qq[api](params)
        qq_rs = qq_rs.status ? qq_rs.data : errorResponse
        let xiami_rs = await provider.xiami[api](params)
        xiami_rs = xiami_rs.status ? xiami_rs.data : errorResponse
        return {
            status: true,
            data: {
                netease: netease_rs,
                qq: qq_rs,
                xiami: xiami_rs
            }
        }
    }
    return {
        ...provider,
        // 搜索歌曲
        searchSong(keyword, offset = 0) {
            // 关键字不能为空
            if (!keyword) {
                return {
                    status: false,
                    msg: '查询参数不能为空'
                }
            }
            return getData('searchSong', {
                keyword,
                offset
            }, {
                total: 0,
                songs: []
            })
        },
        // 获取歌曲详情
        async getSongDetail(vendor, id) {
            await paramsVerify(vendor, id)
            return await provider[vendor]['getSongDetail'](id)
        },
        // 批量获取歌曲详情
        async getBatchSongDetail(vendor, ids) {
            await paramsVerify(vendor, ids)
            return await provider[vendor]['getBatchSongDetail'](ids)
        },
        // 获取歌曲url
        async getSongUrl(vendor, id, br = 128000) {
            await paramsVerify(vendor, id)
            return await provider[vendor]['getSongUrl'](id, br)
        },
        // 获取歌词
        async getLyric(vendor, id) {
            await paramsVerify(vendor, id)
            return await provider[vendor]['getLyric'](id)
        },
        // 获取排行榜
        getTopList(id) {
            // id不能为空
            if (!id) {
                return {
                    status: false,
                    msg: 'id不能为空'
                }
            }
            return provider.netease.getTopList(id)
        },
        // 获取歌曲评论
        async getComment(vendor, id, page = 1, limit = 20) {
            await paramsVerify(vendor, id)
            return await provider[vendor]['getComment'](id, page, limit)
        },
        // 获取歌手单曲
        async getArtistSongs(vendor, id, offset = 0, limit = 50) {
            await paramsVerify(vendor, id)
            return await provider[vendor]['getArtistSongs'](id, offset, limit)
        },
        // 获取歌单歌曲
        async getPlaylistDetail(vendor, id, offset = 0, limit = 65535) {
            await paramsVerify(vendor, id)
            return await provider[vendor]['getPlaylistDetail'](id, offset, limit)
        },
        // 获取专辑详情
        async getAlbumDetail(vendor, id) {
            await paramsVerify(vendor, id)
            return await provider[vendor]['getAlbumDetail'](id)
        },
        // 批量获取任意vendor歌曲详情
        async getAnyVendorSongDetail(arr, timeout = 0) {
            // 先分类
            const songsList = {
                netease: [],
                qq: [],
                xiami: [],
            }
            arr.forEach(item => {
                songsList[item.vendor].push(item.id)
            })
            // 分类 批量获取详情 并存入歌曲对象
            const songsObject = {}
            for (let vendor of Object.keys(songsList)) {
                const list = songsList[vendor]
                if (!list.length) continue
                const limit = {
                    qq: 50,
                    netease: 1000,
                    xiami: 250,
                }[vendor]
                let arr = []
                for (let index = 0; index < list.length; index++) {
                    arr.push(list[index])
                    // 达到限制 或 已是数组最后一个
                    if (arr.length === limit || index + 1 === list.length) {
                        // 获取详情
                        const data = await this.getBatchSongDetail(vendor, arr)
                        if (data.status) {
                            data.data.forEach(song => {
                                songsObject[`${vendor}_${song.id}`] = song
                            })
                        } else {
                            console.warn(`${vendor}获取详情失败`)
                        }
                        // 重置待处理的数组
                        arr = []
                        if (timeout) {
                            await new Promise(resolve => {
                                setTimeout(() => {
                                    resolve()
                                }, timeout)
                            })
                        }
                    }
                }
            }
            // 整理结果
            const rs = []
            for (let {id, vendor} of arr) {
                const song = songsObject[`${vendor}_${id}`]
                if (song) {
                    rs.push(song)
                } else {
                    /*
                    有可能是：歌曲id错误、更改了歌曲id、云平台删歌、批量获取详情失败 此处无法判断
                    且有可能这种状态的歌曲数量较多 调单个获取接口有可能会导致被ban ip 此处直接返null
                    */
                    console.warn(`歌曲无法获取详情：${vendor} ${id}`)
                    rs.push(null)
                }
            }
            return rs
        },
    }
}