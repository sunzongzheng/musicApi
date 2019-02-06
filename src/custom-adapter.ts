import Netease from './netease'

export default function getMusicApi(adapter: any) {
    const netease = new Netease(adapter)
    return {
        netease
    }
}