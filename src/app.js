import musicApi from './music-api'
import instance from './util/flyio.node'

const app = musicApi(instance)

export const qq = app.qq
export const netease = app.netease
export const xiami = app.xiami
export const migu = app.migu
export default app
