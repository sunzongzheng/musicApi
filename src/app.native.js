import musicApi from './music-api'
import instance from './util/flyio.native'

const app = musicApi(instance)

export const qq = app.qq
export const netease = app.netease
export default app

window.musicApi = app