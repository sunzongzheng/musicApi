import {isBrowser} from '../util/index.js'

const Cache = {
    cache: null,
    isBrowser,
    init() {
        if (this.isBrowser) {
            let cache = window.localStorage.getItem('music-api-xiami-cookie-cache')
            if (cache) {
                cache = JSON.parse(cache)
                if (cache.expire > +new Date()) {
                    this.setCache(cache)
                }
            }
        }
    },
    getCache() {
        if (this.cache && this.cache.expire > +new Date()) {
            const {_m_h5_tk, _m_h5_tk_enc} = this.cache
            return {
                cookie: `_m_h5_tk=${_m_h5_tk}; _m_h5_tk_enc=${_m_h5_tk_enc}`,
                signedToken: _m_h5_tk.split('_')[0]
            }
        }
        return null
    },
    setCache({_m_h5_tk, _m_h5_tk_enc, expire = +new Date() + 7 * 24 * 60 * 60 * 1000}) {
        this.cache = {
            _m_h5_tk,
            _m_h5_tk_enc,
            expire
        }
        // 浏览器环境 存localstorage
        if (this.isBrowser) {
            window.localStorage.setItem('music-api-xiami-cookie-cache', JSON.stringify(this.cache))
        }
    }
}

Cache.init()

export default Cache