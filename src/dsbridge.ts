import Netease from './netease'
import adapter from 'flyio/src/adapter/dsbridge'

const netease = new Netease(adapter)

export {
    netease
}