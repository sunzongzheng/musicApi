import express from 'express'
import apicache from 'apicache'
import musicApi from './app'

const app = express()

app.use(apicache.middleware('720 minutes'))

app.get('/', async function (req, res) {
    const method = req.query.method
    const vendor = req.query.vendor
    const params = JSON.parse(req.query.params || '[]')

    if (!method) {
        res.status(400).send({
            error: '参数错误'
        })
        return
    }
    let data
    if (vendor) {
        data = await musicApi[vendor][method](...params)
    } else {
        data = await musicApi[method](...params)
    }
    res.send(data)
})

export default app