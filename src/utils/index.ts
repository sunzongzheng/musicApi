function randomUserAgent() {
    const userAgentList = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
        'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
        'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
    ]
    const num = Math.floor(Math.random() * userAgentList.length)
    return userAgentList[num]
}

const isBrowser = typeof (window) !== 'undefined'

class Err extends Error {
    public msg: string
    public log: null
    constructor(params: { msg: string, log?: any } | string) {
        super()
        if (typeof params === 'string') {
            this.msg = params
        } else {
            this.msg = params.msg
            this.log = params.log
        }
    }
}

class Cache {
    private key = '@suen/music-api/store'
    private store = isBrowser ?
        JSON.parse(localStorage.getItem(this.key) || '{}') :
        {
            'xiami-h5-api-cookie': {
                expire: +new Date() + 24 * 60 * 60 * 1000,
                value: {
                    '_m_h5_tk': '557f23a3b9a7ccb0e3d57b2bf1789faf_1550400183567',
                    '_m_h5_tk_enc': '461f4bb2ffa118d36dd2fa6cdb4bb5e9'
                }
            },
            'xiami-web-api-cookie': {
                expire: +new Date() + 24 * 60 * 60 * 1000,
                value: {
                    xmgid: '5fb7bde1-453c-415b-99da-a08f1fe221c9',
                    xm_sg_tk: '341e3057e816eda1c4619d5c998aa5a1_1550390563354',
                    'xm_sg_tk.sig': 'VP6n9BXsx4o1yAQXDl-V9cmKuPi6ha681yn1mHCwLHQ',
                }
            }
        }

    get(key: string) {
        if (this.store[key] && this.store[key].expire > +new Date()) {
            return this.store[key].value
        }
    }

    set(key: string, value: any, timeout = 24 * 60 * 60 * 1000) {
        this.store[key] = {
            value,
            expire: +new Date() + timeout
        }
        if (isBrowser) {
            localStorage.setItem(this.key, JSON.stringify(this.store))
        }
    }
}

const cache = new Cache()

export {
    randomUserAgent,
    isBrowser,
    Err,
    cache
}