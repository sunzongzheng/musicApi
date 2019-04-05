import Netease from './netease'
import QQ from './qq'
import Xiami from './xiami'

export default function getMusicApi(adapter: any) {
    const netease = new Netease(adapter)
    const qq = new QQ(adapter)
    const xiami = new Xiami(adapter)
    return {
        netease,
        qq,
        xiami
    }
}