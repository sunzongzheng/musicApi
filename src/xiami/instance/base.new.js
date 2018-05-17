export default function (createInstance) {
    const fly = createInstance()
    // fly.config.proxy = 'http://localhost:8888'
    fly.config.baseURL = 'http://acs.m.xiami.com/h5'
    fly.config.timeout = 5000
    fly.config.headers = {
        Host: 'acs.m.xiami.com',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    fly.interceptors.response.use(res => {
        if (!res.data.ret[0].startsWith('SUCCESS')) {
            return Promise.reject(res)
        }
        return res.data.data.data
    }, e => Promise.reject(e))

    return fly
}