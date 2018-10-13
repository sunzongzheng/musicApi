import Netease from './netease'
import QQ from './qq'
import Xiami from './xiami'
import neteaseBase from './netease/instance/base'
import qqBase from './qq/instance/base'
import xiamiBase from './xiami/instance/base'

export default function (instance) {
    const netease = Netease(neteaseBase(instance))
    const qq = QQ(qqBase(instance))
    const xiami = Xiami(xiamiBase(instance))

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
        let netease_rs = await netease[api](params)
        netease_rs = netease_rs.status ? netease_rs.data : errorResponse
        let qq_rs = await qq[api](params)
        qq_rs = qq_rs.status ? qq_rs.data : errorResponse
        let xiami_rs = await xiami[api](params)
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
        netease,
        qq,
        xiami,
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
            return await this[vendor]['getSongDetail'](id)
        },
        // 批量获取歌曲详情
        async getBatchSongDetail(vendor, ids) {
            await paramsVerify(vendor, ids)
            return await this[vendor]['getBatchSongDetail'](ids)
        },
        // 获取歌曲url
        async getSongUrl(vendor, id, br = 128000) {
            await paramsVerify(vendor, id)
            return await this[vendor]['getSongUrl'](id, br)
        },
        // 获取歌词
        async getLyric(vendor, id) {
            await paramsVerify(vendor, id)
            return await this[vendor]['getLyric'](id)
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
            return netease.getTopList(id)
        },
        // 获取歌曲评论
        async getComment(vendor, id, page = 1, limit = 20) {
            await paramsVerify(vendor, id)
            return await this[vendor]['getComment'](id, page, limit)
        },
        // 获取歌手单曲
        async getArtistSongs(vendor, id, offset = 0, limit = 50) {
            await paramsVerify(vendor, id)
            return await this[vendor]['getArtistSongs'](id, offset, limit)
        },
        // 获取歌单歌曲
        async getAlbumSongs(vendor, id, offset = 0, limit = 65535) {
            await paramsVerify(vendor, id)
            return await this[vendor]['getAlbumSongs'](id, offset, limit)
        },
        // 获取专辑详情
        async getAlbumDetail(vendor, id) {
            await paramsVerify(vendor, id)
            return await this[vendor]['getAlbumDetail'](id)
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
                    // 有可能是：歌曲id错误、更改了歌曲id、云平台删歌 此处获取单个歌曲详情 来判断是哪一种
                    const data = await this.getSongDetail(vendor, id)
                    if (data.status) {
                        // 更换了歌曲id
                        rs.push(data.data)
                        console.warn(`更换歌曲id：${vendor} ${id}`)
                    } else {
                        // 删除了歌曲
                        rs.push(null)
                        console.warn(`歌曲ID错误或被删除：${vendor} ${id}`)
                    }
                }
            }
            return rs
        },
    }
}