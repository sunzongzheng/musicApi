// import {randomUserAgent, completeCookie, isBrowser} from '../../util'
// import Encrypt from '../crypto'
// import querystring from 'querystring'

export default function (createInstance) {
    const fly = createInstance()
    fly.config.baseURL = 'https://m.music.migu.cn'
    fly.config.timeout = 5000
    fly.config.rejectUnauthorized = false

    fly.interceptors.request.use(config => {
        return config
    }, e => Promise.reject(e))
    fly.interceptors.response.use(res => {
        if (res.request.pureFly) {
            return res
        }
        if (!res.data) {
            return Promise.reject({
                status: false,
                msg: 'migu请求无结果'
            })
        }
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        if (!data.success) {
            return Promise.reject({
                status: false,
                msg: 'migu请求失败',
                log: res.data
            })
        }
        return data
    }, e => Promise.reject(e))

    return fly
}
