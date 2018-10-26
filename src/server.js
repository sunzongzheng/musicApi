import express from 'express'
import musicApi from './app'

const app = express()

app.get('/', async function (req, res) {
    const method = req.query.method
    const vendor = req.query.vendor
    if (!method) {
        res.status(400).send({
            error: '参数错误'
        })
        return
    }
    const data = await (vendor ? musicApi[vendor][method](req.query.params) : musicApi[method](req.query.params))
    if (data.status) {
        res.send(data.data)
    } else {
        res.status(400).send({
            error: data.msg,
            log: data.log
        })
    }
})

app.listen(process.env.PORT || 3000)