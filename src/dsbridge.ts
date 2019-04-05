import factory from './custom-adapter'
import adapter from 'flyio/src/adapter/dsbridge'

const musicApi = factory(adapter)

export const netease = musicApi.netease
export const qq = musicApi.qq
export const xiami = musicApi.xiami

export default musicApi