import musicApi from './music-api'
import instance from './util/flyio.web'

const app = musicApi(instance)

export const qq = app.qq
export const netease = app.netease
export const xiami = app.xiami
export default app

window.musicApi = app