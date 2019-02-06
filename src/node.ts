/// <reference path="./types/flyio.d.ts"/>
import Netease from './netease'
import QQ from './qq'
import Xiami from './xiami'
import adapter from 'flyio/src/adapter/node'

const netease = new Netease(adapter)
const qq = new QQ(adapter)
const xiami = new Xiami(adapter)

export {
    netease,
    qq,
    xiami
}

export default {
    netease,
    qq,
    xiami
}