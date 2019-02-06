import { randomUserAgent, isBrowser, cache } from '../utils'
import Encrypt from './utils/crypto'
import completeCookie from './utils/complete-cookie'
import Fly from 'flyio/dist/npm/fly'

const loginCacheKey = 'netease-login-cookie'

export default function setApi(Api: Fly) {
    Api.config.baseURL = 'http://music.163.com'
    Api.config.timeout = 5000
    Api.config.rejectUnauthorized = false
    Api.config.headers = {
        Accept: '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
        Connection: 'keep-alive',
        'X-Real-IP': '223.74.158.213', // 此处加上可以解决海外请求的问题
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'http://music.163.com',
        Host: 'music.163.com',
        'User-Agent': randomUserAgent(),
        Cookie: completeCookie()
    }

    Api.interceptors.request.use(config => {
        const cryptoreq = Encrypt(config.body)
        // 浏览器且本地有cookie信息 接口就都带上cookie
        if (isBrowser && cache.get(loginCacheKey)) {
            config.headers.Cookie = loginCacheKey
        }
        config.body = {
            params: cryptoreq.params,
            encSecKey: cryptoreq.encSecKey
        }
        return config
    })
    Api.interceptors.response.use(res => {
        if (!res.data) {
            return Promise.reject({
                msg: '请求无结果',
                log: res
            })
        }
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        if (data.code !== 200) {
            return Promise.reject({
                msg: '请求失败',
                log: res
            })
        }
        return data
    }, e => Promise.reject(e))
}