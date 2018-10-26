import express from 'express'
import apicache from 'apicache'
import musicApi from './app'

const app = express()

app.use(apicache.middleware('720 minutes'))

app.get('/', async function (req, res) {
    const method = req.query.method
    const vendor = req.query.vendor
    const params = req.query.params
    const restParams = req.query.restParams

    if (!method) {
        res.status(400).send({
            error: '参数错误'
        })
        return
    }
    let data
    if (vendor) {
        if (restParams) {
            data = await musicApi[vendor][method](...restParams)
        } else {
            data = await musicApi[vendor][method](params)
        }
    } else {
        if (restParams) {
            data = await musicApi[method](...restParams)
        } else {
            data = await musicApi[method](params)
        }
    }
    res.send(data)
})

app.listen(process.env.PORT || 3000)