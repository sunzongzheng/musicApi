import Cache from '../cache'
import Crypto from "../crypto"
import querystring from 'querystring'

let first = true
const getBody = (api, body) => {
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
            model: body
        })
    })
    const appKey = 12574478
    const t = new Date().getTime()
    const cache = Cache.getCache()
    const sign = Crypto.MD5(
        `${cache ? cache.signedToken : ''}&${t}&${appKey}&${queryStr}`
    )
    return {
        appKey,
        t,
        sign,
        api,
        v: '1.0',
        type: 'originaljson',
        dataType: 'json', // 会变化
        data: queryStr
    }
}
export default function (createInstance) {
    const fly = createInstance()
    // fly.config.proxy = 'http://localhost:8888'
    fly.config.baseURL = 'http://acs.m.xiami.com/h5'
    fly.config.timeout = 5000
    fly.config.headers = {
        Host: 'acs.m.xiami.com',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    fly.config.rejectUnauthorized = false

    fly.interceptors.request.use((request) => {
        if (request.pureFly) {
            request.headers = {}
            request.baseURL = ''
            return request
        }
        if (request.webApi) {
            request.baseURL = 'http://api.xiami.com'
            request.headers = {
                Cookie: 'user_from=2;XMPLAYER_addSongsToggler=0;XMPLAYER_isOpen=0;_xiamitoken=cb8bfadfe130abdbf5e2282c30f0b39a;',
                Referer: 'http://h.xiami.com/'
            }
            const query = querystring.stringify(request.body)
            request.body = query
            request.url += query
            return request
        }
        const cache = Cache.getCache()
        // 第一次请求 或 没有缓存 先锁队列 只放行第一个
        if (first || !cache) {
            fly.lock()
        }
        request.headers.Cookie = `uidXM=1; ${cache ? cache.cookie : ''}`
        request.bodycopy = request.body
        request.body = getBody(request.url, request.body)
        request.urlcopy = request.url
        request.url = `/${request.url}/1.0/`
        return request
    })
    fly.interceptors.response.use(async res => {
        if (res.request.pureFly) {
            return res
        }
        if (res.request.webApi) {
            if (!res.data) {
                return Promise.reject({
                    status: false,
                    msg: '请求无结果'
                })
            }
            if (res.data.state !== 0 && !res.data.status) {
                return Promise.reject({
                    status: false,
                    msg: '请求失败',
                    log: res.data
                })
            }
            return res.data.data
        }
        first = false
        try {
            // 只要返了cookie 就更新token
            if (res.headers['set-cookie']) {
                const cache = {}
                res.headers['set-cookie'].map(item => item.split(';')[0].trim()).map(item => item.split('=')).forEach(item => {
                    cache[item[0]] = item[1]
                })
                Cache.setCache(cache)
                fly.unlock()
                return fly.get(res.request.urlcopy, res.request.bodycopy)
                    .then(data => data)
                    .catch(e => e)
            }
        } catch (e) {
            console.warn('返回cookie格式变化，请检查', res, e)
        }
        fly.unlock()
        const status = res.data.ret[0]
        if (status.startsWith('SUCCESS')) {
            return res.data.data.data
        } else {
            return Promise.reject({
                status: false,
                msg: status.split('::')[1],
                log: res
            })
        }
    }, e => {
        console.warn(e)
        return Promise.reject({
            status: false,
            msg: '请求失败',
            log: e
        })
    })

    return fly
}