/// <reference path="../types/flyio.d.ts"/>
import { randomUserAgent, isBrowser } from '../utils'
import Fly from 'flyio/dist/npm/fly'

function getACSRFToken(cookie: string) {
    function e(e: string) {
        for (var n = 5381, o = 0, t = e.length; t > o; ++o)
            n += (n << 5) + e.charCodeAt(o);
        return 2147483647 & n
    }

    return e(cookie)
}
export default function setApi(Api: Fly) {
    Api.config.baseURL = 'https://c.y.qq.com'
    Api.config.timeout = 5000
    Api.config.parseJson = false
    Api.config.headers = {
        Referer: 'https://y.qq.com/portal/player.html',
        'User-Agent': randomUserAgent()
    }
    Api.config.rejectUnauthorized = false

    Api.interceptors.request.use(config => {
        if (config.newApi) {
            config.baseURL = 'https://u.y.qq.com'
            delete config.newApi
        }
        // 浏览器且本地有cookie信息 接口就都带上cookie
        let loginUin = '0'
        let g_tk = 5381
        if (isBrowser) {
            const loginCookies = localStorage.getItem('@suen/music-api-qq-login-cookie')
            if (loginCookies) {
                try {
                    config.headers.Cookie = loginCookies
                    const cookiesObject: {
                        [key: string]: string
                    } = {}
                    loginCookies.replace(/\s*/g, '').split(';').map(item => item.split('=')).forEach(item => {
                        cookiesObject[item[0]] = item[1]
                    })
                    loginUin = cookiesObject['uin'].substring(2)
                    g_tk = getACSRFToken(cookiesObject["p_skey"] || cookiesObject["skey"] || cookiesObject["p_lskey"] || cookiesObject["lskey"])
                } catch (e) {
                    console.warn(e)
                }
            }
        }
        config.body = Object.assign({}, {
            g_tk,
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            new_json: 1,
        }, config.body)
        return config
    })
    Api.interceptors.response.use(res => {
        if (!res.data) {
            return Promise.reject({
                msg: '请求无结果',
                log: res
            })
        }
        // 是否有回调
        let hasCallback = false
        const callbackArr = ['callback', 'jsonCallback', 'MusicJsonCallback']
        callbackArr.forEach(item => {
            if (res.data.toString().trim().startsWith(item)) {
                const regex = new RegExp(item + '\\(([\\s\\S]*)\\)')
                const match = res.data.match(regex)
                res.data = JSON.parse(match[1])
                hasCallback = true
            }
        })
        if (!hasCallback) {
            return Promise.reject({
                msg: '请求结果错误',
                log: res.data
            })
        }
        // code是否正确
        if (!res.request.nocode && res.data.code !== 0) {
            return Promise.reject({
                msg: '请求结果报错',
                log: res.data
            })
        }
        return res.data
    }, e => {
        console.warn(e)
        return Promise.reject({
            msg: '请求失败',
            log: e
        })
    })
}