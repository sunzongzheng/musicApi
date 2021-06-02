import musicApi from './music-api'

const app = musicApi(function () {
    const Fly = require('flyio/dist/npm/fly')
    return new Fly
})

export const qq = app.qq
export const netease = app.netease
export default app
