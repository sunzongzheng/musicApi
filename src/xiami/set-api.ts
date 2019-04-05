/// <reference path="../types/flyio.d.ts"/>
import { randomUserAgent, cache } from '../utils'
import Fly from 'flyio/dist/npm/fly'
import md5 from 'md5'
import { URL } from 'url'

const keys = {
    web: 'xiami-web-api-cookie',
    h5: 'xiami-h5-api-cookie'
}

export default function setMobileApi(Api: Fly) {
    // Api.config.proxy = 'http://localhost:8888'
    Api.config.timeout = 5000
    Api.config.headers = {
        'User-Agent': randomUserAgent(),
    }
    Api.config.rejectUnauthorized = false

    Api.interceptors.request.use((request) => {
        if (request.webApi) {
            const cookies = cache.get(keys.web)
            if (cookies) {
                request.headers.Cookie = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ')
            }
            if (!request._retryed) {
                const params = request.body
                request.body = {}
                request.body._q = JSON.stringify(params)
                request.url = `https://www.xiami.com/api${request.url}`
            }
            if (cookies && cookies['xm_sg_tk']) {
                const url = new URL(request.url || '')
                request.body._s = md5(`${cookies['xm_sg_tk'].split("_")[0]}_xmMain_${url.pathname}_${request.body._q}`)
            }
        } else {
            request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            const cookies = cache.get(keys.h5)
            if (cookies) {
                request.headers.Cookie = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ')
            }
            if (!request._retryed) {
                const params = request.body
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
                        model: params
                    })
                })
                request.body = {
                    api: request.url,
                    v: '1.0',
                    type: 'originaljson',
                    dataType: 'json',
                    data: queryStr
                }
                request.url = `http://acs.m.xiami.com/h5/${request.url}/1.0/`
            }
            if (cookies && cookies['_m_h5_tk']) {
                request.body.appKey = 12574478
                request.body.t = +new Date()
                request.body.sign = md5(
                    `${cookies['_m_h5_tk'].split('_')[0]}&${request.body.t}&${request.body.appKey}&${request.body.data}`
                )
            }
        }
        return request
    })
    Api.interceptors.response.use(async function (res) {
        // 只要返了cookie 就缓存下来
        const responseCookie = res.headers['set-cookie']
        if (responseCookie) {
            const cookies = (Array.isArray(responseCookie) ? responseCookie : [responseCookie])
            const cacheCookie: { [key: string]: string } = {}
            cookies.map((item: string) => item.split(';')[0].trim()).map((item: string) => item.split('=')).forEach((item: Array<string>) => {
                cacheCookie[item[0]] = item[1]
            })
            cache.set(res.request.webApi ? keys.web : keys.h5, cacheCookie)
            console.log(cacheCookie)
        }
        let code, msg
        if (res.request.webApi) {
            code = res.data.code
            msg = res.data.msg
        } else {
            const split = res.data.ret[0].split('::')
            code = split[0]
            msg = split[1]
        }
        const retry_codes = res.request.webApi ?
            ['SG_TOKEN_EMPTY', 'SG_TOKEN_EXPIRED', 'SG_EMPTY'] :
            ['FAIL_SYS_TOKEN_EMPTY', 'FAIL_SYS_TOKEN_EXOIRED', 'FAIL_SYS_EMPTY']
        if (code === 'SUCCESS') {
            return res.request.webApi ? res.data.result.data : res.data.data.data
        } else if (retry_codes.includes(code)) { // token有问题 重试
            if (res.request._retryed) { // 已重试过
                if (res.request._retryed < 3) { // 次数未超过限制 重试
                    res.request._retryed++
                    return Api.request(res.request)
                } else { // 超过限制 报错
                    return Promise.reject({
                        msg,
                        log: res
                    })
                }
            } else { // 未重试过
                res.request._retryed = 1
                return Api.request(res.request)
            }
        } else { // 抛错
            return Promise.reject({
                msg,
                log: res
            })
        }
    }, e => {
        return Promise.reject({
            msg: '请求失败',
            log: e
        })
    })
}