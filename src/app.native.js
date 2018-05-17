import musicApi from './music-api'
import Netease from './netease'
import QQ from './qq'
import Xiami from './xiami'
import neteaseInstance from './netease/instance/android'
import qqInstance from './qq/instance/android'
import xiamiInstance from './xiami/instance/android'
import xiamiNewApiInstance from './xiami/instance/android.new'

export const netease = Netease(neteaseInstance)
export const qq = QQ(qqInstance)
export const xiami = Xiami(xiamiInstance, xiamiNewApiInstance)

const app = musicApi(netease, qq, xiami)
app.netease = netease
app.qq = qq
app.xiami = xiami

export default app

window.musicApi = app