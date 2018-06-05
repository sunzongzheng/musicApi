export default function (netease, qq, xiami) {
    const api = {
        netease,
        qq,
        xiami
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
    const getData = async (api, params) => {
        let netease_rs = await netease[api](params)
        netease_rs = netease_rs.status ? netease_rs.data : []
        let qq_rs = await qq[api](params)
        qq_rs = qq_rs.status ? qq_rs.data : []
        let xiami_rs = await xiami[api](params)
        xiami_rs = xiami_rs.status ? xiami_rs.data : []
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
            })
        },
        // 获取歌曲详情
        async getSongDetail(vendor, id) {
            await paramsVerify(vendor, id)
            return await api[vendor]['getSongDetail'](id)
        },
        // 批量获取歌曲详情
        async getBatchSongDetail(vendor, ids) {
            await paramsVerify(vendor, ids)
            return await api[vendor]['getBatchSongDetail'](ids)
        },
        // 获取歌曲url
        async getSongUrl(vendor, id) {
            await paramsVerify(vendor, id)
            return await api[vendor]['getSongUrl'](id)
        },
        // 获取歌词
        async getLyric(vendor, id) {
            await paramsVerify(vendor, id)
            return await api[vendor]['getLyric'](id)
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
        async getComment(vendor, id, offset = 0, limit = 20) {
            await paramsVerify(vendor, id)
            return await api[vendor]['getComment'](id, offset, limit)
        },
    }
}