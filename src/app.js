import netease from './netease/index'
import qq from './qq/index'
import xiami from './xiami/index'

const api = {
    netease,
    qq,
    xiami
}
const app = {
    vendors: ['netease', 'qq', 'xiami'],
    // 搜索歌曲
    searchSong(keyword) {
        // 关键字不能为空
        if (!keyword || keyword.toString().trim().length < 1) {
            return {
                status: false,
                msg: '查询参数不能为空'
            }
        }
        return this.getData('searchSong', {
            keyword
        })
    },
    // 获取歌曲url
    getSongUrl(vendor, id) {
        // 参数校验
        if (!this.vendors.includes(vendor)) {
            return {
                status: false,
                msg: 'vendor错误'
            }
        }
        if (id.toString().trim().length < 1) {
            return {
                status: false,
                msg: 'id不能为空'
            }
        }
        return api[vendor]['getSongUrl'](id)
    },
    // 获取歌词
    getLyric(vendor, id) {
        // 参数校验
        if (!this.vendors.includes(vendor)) {
            return {
                status: false,
                msg: 'vendor错误'
            }
        }
        if (id.toString().trim().length < 1) {
            return {
                status: false,
                msg: 'id不能为空'
            }
        }
        return api[vendor]['getLyric'](id)
    },
    // 获取数据
    async getData(api, params) {
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
}
export default app
